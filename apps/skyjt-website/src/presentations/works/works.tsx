import type { JSX } from "@solidjs/web";
import { Loading } from "solid-js";
import { Tabs } from "~/components/Tabs";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import * as v from "valibot";
import { useWorksController, WorksSegmentSchema } from "./works.controller";
import { WorksCarousel } from "./WorksCarousel";
import { MusicWorksGrid } from "./MusicWorksGrid";

function WorksContent(): JSX.Element {
  const c = useWorksController();

  return (
    <section id="Works" class="min-h-screen min-h-dvh w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 animate-fade-in">
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects, experiments, and music scores</BrandSubtitle>

      <Tabs
        value={c.activeSegment()}
        onChange={(val) => {
          const parsed = v.safeParse(WorksSegmentSchema, val);
          if (parsed.success) {
            c.setActiveSegment(parsed.output);
          }
        }}
        class="w-full flex flex-col items-center"
      >
        <Tabs.List class="tabs tabs-box bg-base-200/80 p-1 rounded-full border border-base-300 mb-8">
          <Tabs.Trigger
            value="software"
            class="tab rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 data-[selected]:bg-primary data-[selected]:text-primary-content shadow-sm"
          >
            Software Development
          </Tabs.Trigger>
          <Tabs.Trigger
            value="music"
            class="tab rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 data-[selected]:bg-primary data-[selected]:text-primary-content shadow-sm"
          >
            Music
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="software" class="w-full">
          <WorksCarousel projects={c.projects} />
        </Tabs.Content>

        <Tabs.Content value="music" class="w-full">
          <MusicWorksGrid musicWorks={c.musicWorks} />
        </Tabs.Content>
      </Tabs>
    </section>
  );
}

export function WorksPresentation(): JSX.Element {
  return (
    <Loading
      fallback={
        <section id="Works" class="min-h-screen min-h-dvh w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16">
          <BrandTitle>My Works</BrandTitle>
          <BrandSubtitle>Selected projects, experiments, and music scores</BrandSubtitle>
          <div class="skeleton h-64 w-full max-w-3xl rounded-box mt-8" />
        </section>
      }
    >
      <WorksContent />
    </Loading>
  );
}
