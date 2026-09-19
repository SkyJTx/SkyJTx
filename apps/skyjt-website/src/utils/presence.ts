import {
  createSignal,
  createMemo,
  createEffect,
  untrack,
  type Accessor,
} from "solid-js";

/**
 * Configuration options for the usePresence hook.
 */
export interface PresenceOptions {
  readonly transitionDuration?: number;
  readonly enterDuration?: number;
  readonly exitDuration?: number;
  readonly initialEnter?: boolean;
}

/**
 * Reactive states returned by usePresence.
 */
export interface PresenceResult {
  readonly isMounted: Accessor<boolean>;
  readonly isVisible: Accessor<boolean>;
  readonly isEntering: Accessor<boolean>;
  readonly isExiting: Accessor<boolean>;
}

/**
 * Reactive presence hook orchestrating enter and exit animation lifecycles.
 */
export function usePresence(
  source: Accessor<boolean>,
  options: PresenceOptions = {}
): PresenceResult {
  const exitDuration = () => options.exitDuration ?? options.transitionDuration ?? 200;
  const enterDuration = () => options.enterDuration ?? options.transitionDuration ?? 200;

  const initial = untrack(() => source());
  const [isMounted, setIsMounted] = createSignal(initial);
  const [isVisible, setIsVisible] = createSignal(initial && !options.initialEnter);
  const [hasEntered, setHasEntered] = createSignal(initial && !options.initialEnter);

  createEffect(
    () => source(),
    (active) => {
      if (active) {
        setIsMounted(true);

        if (typeof window !== "undefined") {
          const rafId = requestAnimationFrame(() => {
            setIsVisible(true);
          });
          const enterTimer = setTimeout(() => {
            setHasEntered(true);
          }, enterDuration());

          return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(enterTimer);
          };
        } else {
          setIsVisible(true);
          setHasEntered(true);
        }
      } else {
        setHasEntered(false);
        setIsVisible(false);

        if (typeof window !== "undefined") {
          const exitTimer = setTimeout(() => {
            setIsMounted(false);
          }, exitDuration());

          return () => {
            clearTimeout(exitTimer);
          };
        } else {
          setIsMounted(false);
        }
      }
    }
  );

  const isExiting = createMemo(() => isMounted() && !source());
  const isEntering = createMemo(() => source() && !hasEntered());

  return {
    isMounted,
    isVisible,
    isEntering,
    isExiting,
  };
}