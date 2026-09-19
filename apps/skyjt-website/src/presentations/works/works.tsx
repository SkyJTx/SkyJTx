import type { JSX } from "@solidjs/web";
import { Tabs } from "~/components/Tabs";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Card } from "~/components/Card";
import { useWorksController, type WorksSegment } from "./works.controller";
import { WorksCarousel } from "./WorksCarousel";

/**
 * Works portfolio presentation with accessible Tabs switching between Software Development and Music.
 */
export function WorksPresentation(): JSX.Element {
  const c = useWorksController();

  return (
    <section id="Works" class="w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 animate-fade-in">
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

      <Tabs
        value={c.activeSegment()}
        onChange={(val) => c.setActiveSegment(val as WorksSegment)}
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

        <Tabs.Content value="music" class="w-full max-w-lg mx-auto">
          <Card
            title="Coming Soon"
            description="Music compositions and arrangements are being prepared. Check back soon for updates."
          />
        </Tabs.Content>
      </Tabs>
    </section>
  );
}
