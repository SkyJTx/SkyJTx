import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import { Icon } from "~/components/Icon";
import type { MusicWorkData } from "~/types";
import { MusicWorkCard } from "./MusicWorkCard";
import { useMusicWorksFilter } from "./useMusicWorksFilter";

export interface MusicWorksGridProps {
  readonly musicWorks: readonly MusicWorkData[];
}

export function MusicWorksGrid(props: MusicWorksGridProps): JSX.Element {
  const filter = useMusicWorksFilter(() => props.musicWorks);

  return (
    <Show
      when={props.musicWorks.length > 0}
      fallback={
        <div class="w-full max-w-md mx-auto p-8 rounded-2xl border border-dashed border-base-300/80 bg-base-200/20 backdrop-blur-xs flex flex-col items-center gap-3 text-center">
          <h3 class="text-lg font-bold text-base-content tracking-tight">No Music Scores Found</h3>
          <p class="text-sm text-base-content/70 leading-relaxed">
            Music compositions and arrangements are currently being loaded or updated.
          </p>
        </div>
      }
    >
      <div class="w-full flex flex-col items-center gap-6 animate-fade-in">
        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl">
          <div class="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search scores or instruments..."
              value={filter.searchQuery()}
              onInput={(e) => filter.handleSearchChange(e.currentTarget.value)}
              class="input input-sm sm:input-md input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-200 transition-colors"
            />
          </div>
          <span class="text-xs sm:text-sm text-base-content/60 font-medium">
            Showing {filter.visibleScores().length} of {filter.filteredScores().length} scores
          </span>
        </div>

        <Show
          when={filter.filteredScores().length > 0}
          fallback={
            <div class="py-12 text-center text-base-content/60 text-sm">
              No scores match the search query "{filter.searchQuery()}".
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
            <For each={filter.visibleScores()}>
              {(score) => <MusicWorkCard score={score} />}
            </For>
          </div>
        </Show>

        <Show when={filter.hasMore()}>
          <div class="flex flex-wrap items-center justify-center gap-3 mt-4">
            <button
              type="button"
              class="btn btn-outline btn-sm rounded-xl gap-2 font-medium"
              onClick={() => filter.handleShowMore()}
            >
              <span>Load More</span>
              <Icon name="chevron-down" size={14} />
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-sm rounded-xl text-base-content/70 hover:text-base-content"
              onClick={() => filter.handleShowAll()}
            >
              Show All ({filter.filteredScores().length})
            </button>
          </div>
        </Show>
      </div>
    </Show>
  );
}
