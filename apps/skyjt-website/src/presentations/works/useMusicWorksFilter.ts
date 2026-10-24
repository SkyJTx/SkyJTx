import { createSignal, createMemo, type Accessor } from "solid-js";
import type { MusicWorkData } from "~/types";

export const INITIAL_MUSIC_PAGE_SIZE = 6;
export const MUSIC_PAGE_INCREMENT = 6;

export function useMusicWorksFilter(musicWorks: Accessor<readonly MusicWorkData[]>) {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [visibleCount, setVisibleCount] = createSignal(INITIAL_MUSIC_PAGE_SIZE);

  const filteredScores = createMemo(() => {
    const q = searchQuery().trim().toLowerCase();
    const scores = musicWorks();
    if (!q) {
      return scores;
    }
    return scores.filter(
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
    setVisibleCount((prev) => Math.min(prev + MUSIC_PAGE_INCREMENT, filteredScores().length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredScores().length);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(INITIAL_MUSIC_PAGE_SIZE);
  };

  return {
    searchQuery,
    filteredScores,
    visibleScores,
    hasMore,
    handleShowMore,
    handleShowAll,
    handleSearchChange,
  };
}
