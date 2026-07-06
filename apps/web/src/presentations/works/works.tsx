import { Show } from "solid-js";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { SegmentButton } from "~/components/SegmentButton";
import { Section } from "~/components/Section";
import { Placeholder } from "~/components/Placeholder";
import { ContentFadeIn } from "~/components/ContentFadeIn";
import { useWorksController, type WorksSegment } from "./works.controller";
import { WorksCarousel } from "./WorksCarousel";
import * as S from "./styles";

const SEGMENTS = [
  { value: "software" as const, label: "Software Development" },
  { value: "music" as const, label: "Music" },
];

/**
 * Works presentation with segmented toggle between Software Development and Music.
 */
export function WorksPresentation() {
  const controller = useWorksController();

  return (
    <div id="Works">
      <Section>
        <BrandTitle>My Works</BrandTitle>
        <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

        <S.SegmentRow>
          <SegmentButton
            <WorksSegment>
            segments={SEGMENTS}
            value={controller.activeSegment.value}
            onChange={(v) => {
              controller.activeSegment.value = v;
            }}
          />
        </S.SegmentRow>

        <ContentFadeIn>
          <Show when={controller.activeSegment.value === "software"}>
            <WorksCarousel projects={controller.projectsQuery.data ?? []} />
          </Show>

          <Show when={controller.activeSegment.value === "music"}>
            <Box>
              <Placeholder 
                title="Coming Soon" 
                description="Music compositions and arrangements are being prepared. Check back soon for updates."
              />
            </Box>
          </Show>
        </ContentFadeIn>
      </Section>
    </div>
  );
}
