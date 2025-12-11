import DarkLightToggle from "./DarkLightToggle";
import AccentPicker from "./AccentPicker";
import LanguageDropdown from "./LanguageDropdown";

export default function ThemeControls() {
  return (
    <div
      className="theme-controls relative flex items-center gap-1.5 sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 transition-opacity duration-300 ease-in-out z-999999"
    >
      <LanguageDropdown />
      <DarkLightToggle />
      <AccentPicker />
    </div>
  );
}
