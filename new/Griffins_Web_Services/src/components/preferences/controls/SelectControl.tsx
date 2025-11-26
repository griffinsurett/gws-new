// Shared select control for preference pickers

import { useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControlProps {
  label: string;
  description?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  id?: string;
}

export default function SelectControl({
  label,
  description,
  value,
  options,
  onChange,
  id,
}: SelectControlProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;

  return (
    <div className="mb-6">
      <label
        className="block font-semibold text-heading mb-2"
        htmlFor={controlId}
      >
        {label}
      </label>
      {description && (
        <p id={descriptionId} className="text-sm text-text mb-3">
          {description}
        </p>
      )}
      <select
        id={controlId}
        value={value}
        aria-describedby={descriptionId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-text/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
