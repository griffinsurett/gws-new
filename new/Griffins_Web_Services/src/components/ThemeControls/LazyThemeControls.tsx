import { createLazyComponent } from "@/hooks/useLazyLoad.tsx";

/**
 * LazyThemeControls - Idle-deferred ThemeControls loader
 *
 * Uses the createLazyComponent factory to defer loading
 * until the browser is idle via requestIdleCallback.
 */
export default createLazyComponent(() => import("./ThemeControls"));
