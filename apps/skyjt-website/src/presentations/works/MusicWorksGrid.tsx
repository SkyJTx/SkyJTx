import type { JSX } from "@solidjs/web";
import { createSignal, createMemo, For, Show } from "solid-js";
import { Icon } from "~/components/Icon";
import type { MusicWorkData } from "~/types";
import { MusicWorkCard } from "./MusicWorkCard";

const INITIAL_PAGE_SIZE = 6;
const PAGE_INCREMENT = 6;

/**
 * Properties for MusicWorksGrid component.
 */
export interface MusicWorksGridProps {
  readonly musicWorks: readonly MusicWorkData[];
}

/**
 * Responsive presentation grid displaying sheet music scores with progressive pagination and empty state handling.
 */
export function MusicWorksGrid(props: MusicWorksGridProps): JSX.Element {
  const [visibleCount, setVisibleCount] = createSignal(INITIAL_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = createSignal("");

  const filteredScores = createMemo(() => {
    const q = searchQuery().trim().toLowerCase();
    if (!q) {
      return props.musicWorks;
    }
    return props.musicWorks.filter(
      (score) =>
        score.title.toLowerCase().includes(q) ||
        score.instruments.some((inst) => inst.toLowerCase().includes(q))
    );
  });

  const visibleScores = createMemo(() => {
    return filteredScores().slice(0, visibleCount());
  });

  const hasMore = createMemo(() => {
    return visibleCount() < filteredScores().length;
  });

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_INCREMENT);
  };

  const handleShowAll = () => {
    setVisibleCount(filteredScores().length);
  };

  return (
    <Show
      when={props.musicWorks.length > 0}
      fallback={
        <div class="max-w-lg mx-auto w-full p-8 rounded-2xl border border-dashed border-base-300/80 bg-base-200/20 backdrop-blur-xs flex flex-col items-center gap-3 text-center">
          <div class="p-3.5 rounded-full bg-base-300/50 text-base-content/60">
            <Icon name="file-text" size={24} />
          </div>
          <h3 class="text-lg font-bold text-base-content tracking-tight">No Music Scores Found</h3>
          <p class="text-sm text-base-content/70 leading-relaxed">
            Music compositions and arrangements are currently being loaded or updated.
          </p>
        </div>
      }
    >
      <div class="w-full flex flex-col items-center gap-6">
        {/* Search & Counter Controls */}
        <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl">
          <div class="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search scores or instruments..."
              value={searchQuery()}
              onInput={(e) => {
                setSearchQuery(e.currentTarget.value);
                setVisibleCount(INITIAL_PAGE_SIZE);
              }}
              class="input input-sm sm:input-md input-bordered w-full rounded-xl bg-base-200/50 focus:bg-base-200 transition-colors"
            />
          </div>
          <span class="text-xs sm:text-sm text-base-content/60 font-medium">
            Showing {visibleScores().length} of {filteredScores().length} scores
          </span>
        </div>

        {/* Scores Grid */}
        <Show
          when={filteredScores().length > 0}
          fallback={
            <div class="py-12 text-center text-base-content/60 text-sm">
              No scores match the search query "{searchQuery()}".
            </div>
          }
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
            <For each={visibleScores()}>
              {(score) => <MusicWorkCard score={score} />}
            </For>
          </div>
        </Show>

        {/* Progressive Load Actions */}
        <Show when={hasMore()}>
          <div class="flex flex-wrap items-center justify-center gap-3 mt-4">
            <button
              type="button"
              class="btn btn-outline btn-sm rounded-xl gap-2 font-medium"
              onClick={handleShowMore}
            >
              <span>Load More</span>
              <Icon name="chevron-down" size={14} />
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-sm rounded-xl text-base-content/70 hover:text-base-content"
              onClick={handleShowAll}
            >
              Show All ({filteredScores().length})
            </button>
          </div>
        </Show>
      </div>
    </Show>
  );
}
