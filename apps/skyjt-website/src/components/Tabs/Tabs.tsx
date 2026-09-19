import type { JSX } from "@solidjs/web";
import {
  createContext,
  useContext,
  createSignal,
  createMemo,
  Show,
} from "solid-js";

interface TabsContextValue {
  value: () => string;
  setValue: (val: string) => void;
  registerTrigger: (val: string, el: HTMLButtonElement) => void;
  triggers: () => Map<string, HTMLButtonElement>;
}

const TabsContext = createContext<TabsContextValue>();

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("[Tabs]: useTabs must be used within a <Tabs> component.");
  }
  return ctx;
}

/**
 * Properties for Tabs root component.
 */
export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  class?: string;
  children: JSX.Element;
}

/**
 * Properties for Tabs.List container.
 */
export interface TabsListProps {
  class?: string;
  "aria-label"?: string;
  children: JSX.Element;
}

/**
 * Properties for Tabs.Trigger tab button.
 */
export interface TabsTriggerProps {
  value: string;
  class?: string;
  disabled?: boolean;
  children: JSX.Element;
}

/**
 * Properties for Tabs.Content panel.
 */
export interface TabsContentProps {
  value: string;
  class?: string;
  children: JSX.Element;
}

function TabsRoot(props: TabsProps): JSX.Element {
  const [internalValue, setInternalValue] = createSignal(
    props.defaultValue ?? ""
  );
  const [triggersMap, setTriggersMap] = createSignal(
    new Map<string, HTMLButtonElement>()
  );

  const activeValue = createMemo(() => props.value ?? internalValue());

  const handleSelect = (val: string) => {
    if (props.value === undefined) {
      setInternalValue(val);
    }
    props.onChange?.(val);
  };

  const registerTrigger = (val: string, el: HTMLButtonElement) => {
    setTriggersMap((prev) => {
      const next = new Map(prev);
      next.set(val, el);
      return next;
    });
  };

  const contextValue: TabsContextValue = {
    value: activeValue,
    setValue: handleSelect,
    registerTrigger,
    triggers: triggersMap,
  };

  return (
    <TabsContext value={contextValue}>
      <div class={props.class}>{props.children}</div>
    </TabsContext>
  );
}

function TabsList(props: TabsListProps): JSX.Element {
  const ctx = useTabs();

  const handleKeyDown = (e: KeyboardEvent) => {
    const triggers = Array.from(ctx.triggers().entries());
    if (triggers.length === 0) return;

    const currentIndex = triggers.findIndex(([v]) => v === ctx.value());
    if (currentIndex === -1) return;

    let targetIndex = -1;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        targetIndex = (currentIndex + 1) % triggers.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        break;
      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;
      case "End":
        e.preventDefault();
        targetIndex = triggers.length - 1;
        break;
    }

    if (targetIndex !== -1) {
      const [nextVal, nextEl] = triggers[targetIndex];
      ctx.setValue(nextVal);
      nextEl.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={props["aria-label"]}
      onKeyDown={handleKeyDown}
      class={props.class}
    >
      {props.children}
    </div>
  );
}

function TabsTrigger(props: TabsTriggerProps): JSX.Element {
  const ctx = useTabs();
  const isSelected = createMemo(() => ctx.value() === props.value);

  return (
    <button
      ref={(el) => ctx.registerTrigger(props.value, el)}
      role="tab"
      type="button"
      id={`tab-${props.value}`}
      aria-controls={`panel-${props.value}`}
      aria-selected={isSelected() ? "true" : "false"}
      tabindex={isSelected() ? 0 : -1}
      disabled={props.disabled}
      data-selected={isSelected() ? "" : undefined}
      onClick={() => ctx.setValue(props.value)}
      class={props.class}
    >
      {props.children}
    </button>
  );
}

function TabsContent(props: TabsContentProps): JSX.Element {
  const ctx = useTabs();
  const isSelected = createMemo(() => ctx.value() === props.value);

  return (
    <Show when={isSelected()}>
      <div
        role="tabpanel"
        id={`panel-${props.value}`}
        aria-labelledby={`tab-${props.value}`}
        tabindex={0}
        class={props.class}
      >
        {props.children}
      </div>
    </Show>
  );
}

/**
 * Accessible compound Tabs component following WAI-ARIA tab list guidelines.
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});