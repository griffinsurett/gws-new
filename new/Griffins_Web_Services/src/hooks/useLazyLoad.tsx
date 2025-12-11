/**
 * useLazyLoad - Universal lazy loading hook
 *
 * Works with Astro's client directives. Four trigger modes:
 *
 * IDLE: Load when browser is idle (best for non-critical UI)
 *   const { Component } = useLazyLoad(() => import("./Foo"), { idle: true });
 *
 * DELAY: Load after timeout
 *   const { Component } = useLazyLoad(() => import("./Foo"), { delay: 3000 });
 *
 * CLICK: Load when element clicked (one-time)
 *   const { Component } = useLazyLoad(() => import("./Foo"), { triggerId: "btn" });
 *
 * TOGGLE: Load on click + manage open/close state
 *   const { Component, isOpen, close } = useLazyLoad(() => import("./Foo"), {
 *     triggerId: "btn",
 *     toggle: true
 *   });
 */

import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

interface IdleOptions {
  /** Load when browser is idle via requestIdleCallback */
  idle: true;
  /** Timeout for requestIdleCallback (default: 3000ms) */
  idleTimeout?: number;
  delay?: never;
  skipIf?: never;
  triggerId?: never;
  toggle?: never;
}

interface DelayOptions {
  /** Delay in ms before loading */
  delay: number;
  /** Skip if returns true */
  skipIf?: () => boolean;
  idle?: never;
  idleTimeout?: never;
  triggerId?: never;
  toggle?: never;
}

interface ClickOptions {
  /** Element ID that triggers load on click */
  triggerId: string;
  /** If true, manages open/close state */
  toggle?: boolean;
  idle?: never;
  idleTimeout?: never;
  delay?: never;
  skipIf?: never;
}

type Options = IdleOptions | DelayOptions | ClickOptions;

interface Result<P> {
  Component: ComponentType<P> | null;
  isLoaded: boolean;
  isOpen: boolean;
  close: () => void;
}

export function useLazyLoad<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
  options: Options
): Result<P> {
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const started = useRef(false);

  const idle = "idle" in options ? options.idle : undefined;
  const idleTimeout = "idleTimeout" in options ? options.idleTimeout : 3000;
  const triggerId = "triggerId" in options ? options.triggerId : undefined;
  const toggle = "toggle" in options ? options.toggle : false;
  const delay = "delay" in options ? options.delay : undefined;
  const skipIf = "skipIf" in options ? options.skipIf : undefined;

  const doLoad = useCallback((cb?: () => void) => {
    if (started.current) {
      cb?.();
      return;
    }
    started.current = true;
    load().then((m) => {
      setComponent(() => m.default);
      cb?.();
    });
  }, [load]);

  const close = useCallback(() => {
    setIsOpen(false);
    if (triggerId) {
      document.getElementById(triggerId)?.setAttribute("aria-expanded", "false");
    }
  }, [triggerId]);

  // Idle trigger - uses requestIdleCallback with Safari fallback
  useEffect(() => {
    if (!idle) return;
    if (started.current) return;

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => doLoad(), { timeout: idleTimeout });
      return () => cancelIdleCallback(id);
    } else {
      // Safari fallback: rAF → setTimeout(0) for idle approximation
      let rafId: number;
      let timeoutId: number;
      rafId = requestAnimationFrame(() => {
        timeoutId = window.setTimeout(() => doLoad(), 0);
      });
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
      };
    }
  }, [idle, idleTimeout, doLoad]);

  // Delay trigger
  useEffect(() => {
    if (delay === undefined) return;
    if (skipIf?.()) return;
    if (started.current) return;

    const id = setTimeout(() => doLoad(), delay);
    return () => clearTimeout(id);
  }, [delay, skipIf, doLoad]);

  // Click/Toggle trigger
  useEffect(() => {
    if (!triggerId) return;

    const el = document.getElementById(triggerId);
    if (!el) return;

    const onClick = () => {
      if (!started.current) {
        doLoad(() => {
          if (toggle) {
            setIsOpen(true);
            el.setAttribute("aria-expanded", "true");
          }
        });
      } else if (toggle) {
        setIsOpen((prev) => {
          const next = !prev;
          el.setAttribute("aria-expanded", String(next));
          return next;
        });
      }
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [triggerId, toggle, doLoad]);

  return {
    Component,
    isLoaded: Component !== null,
    isOpen,
    close,
  };
}

/**
 * createLazyComponent - Factory for idle-deferred component wrappers
 *
 * Creates a component that defers loading until browser is idle.
 * Use this for simple cases where you don't need state management.
 *
 * @example
 * // LazyThemeControls.tsx
 * export default createLazyComponent(() => import("./ThemeControls"));
 *
 * // Usage in Astro
 * <LazyThemeControls client:idle />
 */
export function createLazyComponent<P extends object = object>(
  load: () => Promise<{ default: ComponentType<P> }>,
  options: { idleTimeout?: number } = {}
) {
  return function LazyComponent(props: P): ReactNode {
    const { Component } = useLazyLoad<P>(load, { idle: true, ...options });
    if (!Component) return null;
    return <Component {...props} />;
  };
}

export default useLazyLoad;
