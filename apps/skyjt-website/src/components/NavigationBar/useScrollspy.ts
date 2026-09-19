import { onSettled } from "solid-js";
import type { NavigationContextValue } from "./NavigationContext";

/**
 * Configuration options for the useScrollspy hook.
 */
export interface UseScrollspyOptions {
  readonly sections: readonly string[];
  readonly nav: NavigationContextValue;
  readonly headerOffset?: number;
}

/**
 * Dominance-based scrollspy hook tracking active section visibility using multi-threshold IntersectionObserver.
 */
export function useScrollspy(options: UseScrollspyOptions): void {
  onSettled(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const { sections, nav, headerOffset = 64 } = options;
    const visibleSections = new Map<string, IntersectionObserverEntry>();

    const updateActiveSection = () => {
      if (nav.isProgrammaticScroll()) {
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      if (scrollY <= headerOffset) {
        const firstSection = sections[0];
        if (firstSection && nav.activeSection() !== firstSection) {
          nav.setActiveSection(firstSection);
        }
        return;
      }

      if (scrollY + windowHeight >= scrollHeight - 50) {
        const lastSection = sections[sections.length - 1];
        if (lastSection && nav.activeSection() !== lastSection) {
          nav.setActiveSection(lastSection);
        }
        return;
      }

      if (visibleSections.size > 0) {
        let bestEntry: IntersectionObserverEntry | null = null;
        let maxRatio = -1;

        for (const entry of visibleSections.values()) {
          if (!entry.isIntersecting) {
            continue;
          }

          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestEntry = entry;
          } else if (bestEntry && Math.abs(entry.intersectionRatio - maxRatio) < 0.1) {
            const currentDist = Math.abs(entry.boundingClientRect.top - headerOffset);
            const bestDist = Math.abs(bestEntry.boundingClientRect.top - headerOffset);
            if (currentDist < bestDist) {
              bestEntry = entry;
            }
          }
        }

        if (bestEntry && bestEntry.target.id) {
          const id = bestEntry.target.id;
          if (nav.activeSection() !== id) {
            nav.setActiveSection(id);
          }
          return;
        }
      }

      let candidateId: string | null = null;
      let minDistance = Infinity;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (!el) {
          continue;
        }
        const rect = el.getBoundingClientRect();
        if (rect.bottom > headerOffset && rect.top <= windowHeight * 0.5) {
          const dist = Math.abs(rect.top - headerOffset);
          if (dist < minDistance) {
            minDistance = dist;
            candidateId = sectionId;
          }
        }
      }

      if (candidateId && nav.activeSection() !== candidateId) {
        nav.setActiveSection(candidateId);
      }
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-15% 0px -40% 0px",
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry);
        } else {
          visibleSections.delete(entry.target.id);
        }
      }
      updateActiveSection();
    }, observerOptions);

    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) {
        observer.observe(el);
      }
    }

    const handleScroll = () => {
      if (!nav.isProgrammaticScroll()) {
        updateActiveSection();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  });
}
