import type { JSX } from "@solidjs/web";
import { Loading } from "solid-js";
import { Tabs } from "~/components/Tabs";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Icon } from "~/components/Icon";
import { useWorksController, type WorksSegment } from "./works.controller";
import { WorksCarousel } from "./WorksCarousel";

/**
 * Inner works presentation content reading projects from controller.
 */
function WorksContent(): JSX.Element {
  const c = useWorksController();

  return (
    <section id="Works" class="min-h-screen min-h-dvh w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 animate-fade-in">
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
          <div class="p-8 rounded-2xl border border-dashed border-base-300/80 bg-base-200/20 backdrop-blur-xs flex flex-col items-center gap-3 text-center">
            <div class="p-3.5 rounded-full bg-primary/10 text-primary">
              <Icon name="file-text" size={24} />
            </div>
            <h3 class="text-lg font-bold text-base-content tracking-tight">Coming Soon</h3>
            <p class="text-sm text-base-content/70 leading-relaxed">
              Music compositions and arrangements are being prepared. Check back soon for updates.
            </p>
          </div>
        </Tabs.Content>
      </Tabs>
    </section>
  );
}

/**
 * Works portfolio presentation with accessible Tabs wrapped in a Loading boundary.
 */
export function WorksPresentation(): JSX.Element {
  return (
    <Loading
      fallback={
        <section id="Works" class="min-h-screen min-h-dvh w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16">
          <BrandTitle>My Works</BrandTitle>
          <BrandSubtitle>Selected projects and experiments</BrandSubtitle>
          <div class="skeleton h-64 w-full max-w-3xl rounded-box mt-8" />
        </section>
      }
    >
      <WorksContent />
    </Loading>
  );
}
