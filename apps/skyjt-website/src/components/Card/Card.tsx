import type { JSX } from "@solidjs/web";
import { children, Show, type ParentProps } from "solid-js";

/**
 * Properties for the Card component.
 */
export interface CardProps extends ParentProps {
  media?: JSX.Element;
  title?: string;
  description?: JSX.Element | string;
  actions?: JSX.Element;
}

/**
 * DaisyUI Card component with media, content, and action sections.
 */
export function Card(props: CardProps): JSX.Element {
  const media = children(() => props.media);
  const actions = children(() => props.actions);

  return (
    <div class="card bg-base-200/50 backdrop-blur-md border border-base-300 shadow-xl rounded-box overflow-hidden flex flex-col h-full hover:border-primary/40 transition-all duration-300">
      <Show when={media()}>
        <figure class="w-full relative overflow-hidden bg-base-300/40 aspect-video">
          {media()}
        </figure>
      </Show>

      <div class="card-body p-5 flex flex-col flex-1">
        <Show when={props.title}>
          <h3 class="card-title text-xl font-bold text-base-content tracking-tight">
            {props.title}
          </h3>
        </Show>

        <Show when={props.description}>
          <p class="text-sm text-base-content/80 leading-relaxed my-2 flex-1">
            {props.description}
          </p>
        </Show>

        {props.children}

        <Show when={actions()}>
          <div class="card-actions justify-end mt-4 pt-3 border-t border-base-300/60 flex flex-wrap gap-2">
            {actions()}
          </div>
        </Show>
      </div>
    </div>
  );
}
