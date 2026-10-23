import type { JSX } from "@solidjs/web";
import { createSignal, For, Show } from "solid-js";
import { Card } from "~/components/Card";
import { Icon } from "~/components/Icon";
import type { MusicWorkData } from "~/types";

/**
 * Properties for MusicWorkCard component.
 */
export interface MusicWorkCardProps {
  score: MusicWorkData;
}

/**
 * Individual sheet music score card displaying preview, metadata, and MuseScore links.
 */
export function MusicWorkCard(props: MusicWorkCardProps): JSX.Element {
  const [hasImageError, setHasImageError] = createSignal(false);

  const media = () => (
    <div class="relative w-full h-full overflow-hidden bg-base-300/40 group/media flex items-center justify-center">
      <Show
        when={props.score.thumbnailUrl && !hasImageError()}
        fallback={
          <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-2 text-base-content/40">
            <Icon name="file-text" size={36} />
            <span class="text-xs font-medium">Sheet Music</span>
          </div>
        }
      >
        <img
          src={props.score.thumbnailUrl}
          alt={props.score.title}
          loading="lazy"
          onError={() => setHasImageError(true)}
          class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </Show>

      <Show when={props.score.duration}>
        <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[11px] font-semibold text-white/95 shadow-xs flex items-center gap-1">
          <span>{props.score.duration}</span>
        </div>
      </Show>
    </div>
  );

  const actions = () => (
    <a
      href={props.score.scoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary btn-xs sm:btn-sm gap-1.5 shadow-sm"
    >
      <Icon name="external-link" size={14} />
      View on MuseScore
    </a>
  );

  return (
    <Card media={media()} title={props.score.title} actions={actions()}>
      <div class="flex flex-col gap-2.5 my-2 flex-1">
        <div class="flex flex-wrap items-center gap-2 text-xs text-base-content/70">
          <Show when={props.score.partsCount}>
            <span class="inline-flex items-center gap-1">
              <span>{props.score.partsCount}</span>
            </span>
          </Show>
          <Show when={props.score.pagesCount}>
            <span class="text-base-content/40">•</span>
            <span>{props.score.pagesCount}</span>
          </Show>
          <Show when={props.score.date}>
            <span class="text-base-content/40">•</span>
            <span>{props.score.date}</span>
          </Show>
          <Show when={props.score.views}>
            <span class="text-base-content/40">•</span>
            <span>{props.score.views}</span>
          </Show>
        </div>

        <Show when={props.score.instruments.length > 0}>
          <div class="flex flex-wrap gap-1 mt-1">
            <For each={props.score.instruments}>
              {(tag) => (
                <span class="badge badge-sm badge-outline border-base-300/80 text-[11px] text-base-content/80 font-medium">
                  {tag}
                </span>
              )}
            </For>
          </div>
        </Show>
      </div>
    </Card>
  );
}
