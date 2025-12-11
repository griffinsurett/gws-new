import { useEffect, useRef, useState } from "react";
import { CircleCheckbox } from "./checkboxes/CircleCheckbox";

// Inline checkmark SVG to avoid importing the entire icon system
const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-primary"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
import {
  supportedLanguages,
  getLanguageByCode,
  defaultLanguage,
  type Language,
} from "@/utils/languageTranslation/languages";

// Quick sync check via cookie - doesn't require loading the heavy consent module
const hasFunctionalConsentFast = () => {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/cookie-consent=([^;]*)/);
  if (!match) return false;
  try {
    const consent = JSON.parse(decodeURIComponent(match[1]));
    return consent?.functional === true;
  } catch {
    return false;
  }
};

const CONSENT_MESSAGE =
  "Please enable functional cookies to use the language switcher. You can manage your preferences in the cookie settings.";

// Check if native translation is available AND enabled via config
const hasNativeTranslation = () => {
  if (typeof window === "undefined") return false;
  // Check both browser support AND config setting from BrowserTranslateScript
  const config = (window as any).getTranslationConfig?.();
  const enabledInConfig = config?.enableNative !== false;
  return enabledInConfig && "Translator" in window;
};

// Check if Google Translate is enabled via config
const isGoogleTranslateEnabled = () => {
  if (typeof window === "undefined") return true; // Default to true for SSR
  const config = (window as any).getTranslationConfig?.();
  return config?.enableGoogle !== false;
};

// Check if any translation method is available
const isTranslationAvailable = () => {
  return hasNativeTranslation() || isGoogleTranslateEnabled();
};

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return defaultLanguage;
  const code = localStorage.getItem("user-language") || defaultLanguage.code;
  return getLanguageByCode(code) || defaultLanguage;
}

// Lazy-loaded modal component
type ModalComponent = React.ComponentType<{ isOpen: boolean; onClose: () => void }>;

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  // Always start with defaultLanguage to avoid hydration mismatch
  // localStorage is read in useEffect after hydration
  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [ConsentModal, setConsentModal] = useState<ModalComponent | null>(null);
  const [hasFunctionalConsent, setHasFunctionalConsent] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Read from localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    setCurrentLanguage(getStoredLanguage());
    setHasFunctionalConsent(hasFunctionalConsentFast());
  }, []);

  // Re-check consent when dropdown opens (user may have changed it)
  useEffect(() => {
    if (open) {
      setHasFunctionalConsent(hasFunctionalConsentFast());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "user-language") return;
      setCurrentLanguage(
        getLanguageByCode(event.newValue || defaultLanguage.code) ||
          defaultLanguage,
      );
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleOpenConsentModal = () => {
    // Lazy load the consent modal only when user clicks
    if (!ConsentModal) {
      import("@/components/preferences/consent/CookiePreferencesModal").then((m) => {
        setConsentModal(() => m.default);
        setShowConsentModal(true);
      });
    } else {
      setShowConsentModal(true);
    }
    setOpen(false);
  };

  const handleCloseConsentModal = () => {
    setShowConsentModal(false);
    // Re-check consent after modal closes
    setHasFunctionalConsent(hasFunctionalConsentFast());
  };

  const handleLanguageChange = (code: string) => {
    // Native translation doesn't need consent
    // Google Translate needs consent (if enabled)
    // If neither is available, translation won't work
    const googleEnabled = isGoogleTranslateEnabled();
    const nativeAvailable = hasNativeTranslation();
    const needsConsent = !nativeAvailable && googleEnabled && !hasFunctionalConsent;

    if (needsConsent && code !== "en") {
      alert(CONSENT_MESSAGE);
      return;
    }

    // If no translation method is available, warn the user
    if (!nativeAvailable && !googleEnabled && code !== "en") {
      alert("Translation is currently disabled.");
      return;
    }

    const nextLanguage = getLanguageByCode(code);
    if (nextLanguage) {
      setCurrentLanguage(nextLanguage);
    }

    if (typeof window !== "undefined" && (window as any).changeLanguage) {
      (window as any).changeLanguage(code);
    }

    setOpen(false);
  };

  const buttonClasses = [
    "faded-bg",
    open ? "ring-2 ring-primary/60" : "",
    "text-primary",
  ]
    .filter(Boolean)
    .join(" ");

  const currentCode =
    currentLanguage.code?.split("-")[0]?.toUpperCase() || "EN";
  const currentFlag = currentLanguage.flag;

  return (
    <div ref={containerRef} className="relative contents">
      <CircleCheckbox
        checked={open}
        onChange={() => setOpen((value) => !value)}
        aria-label="Choose display language"
        title={
          hasNativeTranslation() || hasFunctionalConsent || !isGoogleTranslateEnabled()
            ? "Choose your site language"
            : "Enable functional cookies to change language"
        }
        className={buttonClasses}
      >
        <div className="flex items-center justify-center">
          {currentFlag ? (
            <span className="text-xl leading-none" aria-hidden="true">
              {currentFlag}
            </span>
          ) : (
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              aria-hidden="true"
            >
              {currentCode}
            </span>
          )}
        </div>
      </CircleCheckbox>

      {open && (
        <div
          className="absolute top-full left-1/2 z-[60] mt-3 min-w-[220px] -translate-x-1/2 rounded-2xl border card-bg p-3 shadow-2xl backdrop-blur-xl"
          onWheel={(event) => {
            // Prevent wheel scroll from bubbling to window (which hides the logo text)
            event.stopPropagation();
          }}
          onWheelCapture={(event) => event.stopPropagation()}
        >
          {/* Only show consent banner if native is not available AND Google is enabled but no consent */}
          {!hasNativeTranslation() && isGoogleTranslateEnabled() && !hasFunctionalConsent && (
            <button
              type="button"
              onClick={handleOpenConsentModal}
              className="mb-2 rounded-xl border border-yellow-400/40 bg-yellow-500/15 px-3 py-2 text-xs text-text text-left transition hover:border-yellow-400 hover:bg-yellow-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Enable functional cookies to switch languages.
              <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-primary">
                Manage consent preferences
              </span>
            </button>
          )}

          <div className="flex max-h-64 flex-col overflow-y-auto">
            {supportedLanguages.map((language) => {
              const isActive = language.code === currentLanguage.code;
              return (
                <button
                  key={language.code}
                  type="button"
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-primary/20 text-primary font-semibold"
                      : "hover:bg-white/5 text-text"
                  } ${!hasNativeTranslation() && isGoogleTranslateEnabled() && !hasFunctionalConsent ? "cursor-not-allowed opacity-60" : ""}`}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={!hasNativeTranslation() && isGoogleTranslateEnabled() && !hasFunctionalConsent}
                >
                  {language.flag && (
                    <span className="text-lg" aria-hidden="true">
                      {language.flag}
                    </span>
                  )}
                  <span className="flex-1 text-left">
                    <span className="block text-base leading-tight">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-text/70">
                      {language.name}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="text-primary"
                      aria-label="Currently selected language"
                    >
                      <CheckIcon />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showConsentModal && ConsentModal && (
        <ConsentModal
          isOpen={showConsentModal}
          onClose={handleCloseConsentModal}
        />
      )}
    </div>
  );
}
