import type { JSX } from "@solidjs/web";
import { children, Show, type ParentProps } from "solid-js";

/**
 * Properties for the Card component.
 */
export interface CardProps extends ParentProps {
  readonly media?: JSX.Element;
  readonly title?: string;
  readonly description?: JSX.Element | string;
  readonly actions?: JSX.Element;
}

/**
 * Modern surface component with media, content, and action sections.
 */
export function Card(props: CardProps): JSX.Element {
  const media = children(() => props.media);
  const description = children(() => props.description);
  const actions = children(() => props.actions);

  return (
    <div class="group bg-base-200/30 hover:bg-base-200/60 backdrop-blur-sm border border-base-300/60 hover:border-primary/40 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      <Show when={media()}>
        <figure class="w-full relative overflow-hidden bg-base-300/30 aspect-video">
          {media()}
        </figure>
      </Show>

      <div class="p-5 sm:p-6 flex flex-col flex-1">
        <Show when={props.title}>
          <h3 class="text-xl font-bold text-base-content tracking-tight group-hover:text-primary transition-colors">
            {props.title}
          </h3>
        </Show>

        <Show when={description()}>
          <p class="text-sm text-base-content/80 leading-relaxed my-2 flex-1">
            {description()}
          </p>
        </Show>

        {props.children}

        <Show when={actions()}>
          <div class="mt-4 pt-3.5 border-t border-base-300/40 flex flex-wrap gap-2 justify-end">
            {actions()}
          </div>
        </Show>
      </div>
    </div>
  );
}
