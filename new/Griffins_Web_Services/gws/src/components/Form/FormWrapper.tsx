// src/components/Form/FormWrapper.tsx
/**
 * React Form Wrapper - HTML5 Validation Only
 * Handles submission logic/state and exposes minimal context for helpers.
 */

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import SuccessMessage from "./messages/SuccessMessage";
import ErrorMessage from "./messages/ErrorMessage";
import LoadingMessage from "./messages/LoadingMessage";
import { FormContext } from "./FormContext";

export interface FormWrapperProps {
  children: ReactNode;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  resetOnSuccess?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function FormWrapper({
  children,
  onSubmit,
  successMessage = "Form submitted successfully!",
  errorMessage = "An error occurred. Please try again.",
  loadingMessage = "Submitting your form...",
  resetOnSuccess = false,
  className = "",
  onSuccess,
  onError,
}: FormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const childrenArray = Children.toArray(children);
  const formSteps = childrenArray.filter(
    (child) =>
      isValidElement(child) && (child.type as any).displayName === "FormStep"
  );
  const isMultiStep = formSteps.length > 0;
  const totalSteps = isMultiStep ? formSteps.length : 1;

  const goToStep = (stepIndex: number) => {
    if (!isMultiStep) return;
    setCurrentStep((prev) => {
      if (Number.isNaN(stepIndex)) return prev;
      return Math.max(0, Math.min(totalSteps - 1, stepIndex));
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    try {
      setIsSubmitting(true);
      setStatus("submitting");
      setMessage(null);

      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        const values = formData.getAll(key);
        if (values.length > 1) {
          data[key] = values;
        } else if (form.querySelector(`[name="${key}"][type="checkbox"]`)) {
          data[key] = value === "on";
        } else {
          data[key] = value;
        }
      });

      await onSubmit(data);

      setStatus("success");
      setMessage(successMessage);

      if (resetOnSuccess) {
        form.reset();
        setCurrentStep(0);
      }

      onSuccess?.();
    } catch (err) {
      setStatus("error");
      const errMsg = err instanceof Error ? err.message : errorMessage;
      setMessage(errMsg);
      onError?.(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const dismissMessage = () => {
    setMessage(null);
    setStatus("idle");
  };

  const renderContent = () => {
    if (isMultiStep) {
      return formSteps[currentStep];
    }
    return children;
  };

  const contextValue = useMemo(
    () => ({
      isMultiStep,
      currentStep,
      totalSteps,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === totalSteps - 1,
      isSubmitting,
      nextStep,
      previousStep,
      goToStep,
    }),
    [currentStep, isSubmitting, isMultiStep, totalSteps]
  );

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={className} noValidate={false}>
        {status === "submitting" && (
          <LoadingMessage>{loadingMessage}</LoadingMessage>
        )}

        {status === "success" && message && (
          <SuccessMessage onDismiss={dismissMessage}>{message}</SuccessMessage>
        )}

        {status === "error" && message && (
          <ErrorMessage onDismiss={dismissMessage}>{message}</ErrorMessage>
        )}

        {renderContent()}

        {isMultiStep && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={previousStep}
                disabled={isSubmitting}
                className="px-6 py-2 border border-surface rounded-lg text-text hover:bg-text/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            <div className="text-sm text-text">
              Step {currentStep + 1} of {totalSteps}
            </div>

            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-bg rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-bg rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        )}
      </form>
    </FormContext.Provider>
  );
}
