import type { JSX, ValidComponent } from "@solidjs/web";
import { Show, createMemo } from "solid-js";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
  Tabs as KobalteTabs,
  useTabsContext,
  type TabsRootProps as KobalteTabsRootProps,
  type TabsListProps as KobalteTabsListProps,
  type TabsTriggerProps as KobalteTabsTriggerProps,
} from "@kobalte/core/tabs";

export type TabsProps<T extends ValidComponent = "div"> = PolymorphicProps<T, KobalteTabsRootProps<T>>;
export type TabsListProps<T extends ValidComponent = "div"> = PolymorphicProps<T, KobalteTabsListProps<T>>;
export type TabsTriggerProps<T extends ValidComponent = "button"> = PolymorphicProps<T, KobalteTabsTriggerProps<T>>;

export interface TabsContentProps {
  value: string;
  class?: string;
  children: JSX.Element;
}

const OriginalList = KobalteTabs.List;

function CustomTabsList<T extends ValidComponent = "div">(
  props: TabsListProps<T>
): JSX.Element {
  let listRef: HTMLDivElement | undefined;

  const handleKeyDown = (e: KeyboardEvent) => {
    const tabs = Array.from(
      listRef?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex(
      (el) => el.getAttribute("aria-selected") === "true"
    );
    let targetIndex = currentIndex >= 0 ? currentIndex : 0;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      targetIndex = (targetIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      targetIndex = (targetIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = tabs.length - 1;
    } else {
      return;
    }

    const targetTab = tabs[targetIndex];
    if (targetTab) {
      targetTab.focus();
      targetTab.click();
    }
  };

  return (
    <OriginalList
      {...props}
      ref={(el) => {
        listRef = el;
      }}
      onKeyDown={handleKeyDown}
    />
  );
}

function CustomTabsContent(props: TabsContentProps): JSX.Element {
  const context = useTabsContext();
  const isSelected = createMemo(
    () => context.listState().selectedKey() === props.value
  );

  return (
    <Show when={isSelected()}>
      <div
        id={context.generateContentId(props.value)}
        role="tabpanel"
        tabindex={0}
        aria-labelledby={context.triggerIdsMap().get(props.value)}
        class={["animate-fade-in", props.class]}
      >
        {props.children}
      </div>
    </Show>
  );
}

/**
 * Accessible compound Tabs component backed by @kobalte/core/tabs.
 */
export const Tabs = Object.assign(
  KobalteTabs,
  {
    List: CustomTabsList,
    Trigger: KobalteTabs.Trigger,
    Content: CustomTabsContent,
    Indicator: KobalteTabs.Indicator,
  }
);
