import { Show } from "solid-js";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { SegmentButton } from "~/components/SegmentButton";
import { useWorksController, type WorksSegment } from "./works.controller";
import { WorksCarousel } from "./WorksCarousel";
import * as S from "./styles";
import { useTheme } from "solid-styled-components";

const SEGMENTS = [
  { value: "software" as const, label: "Software Development" },
  { value: "music" as const, label: "Music" },
];

/**
 * Works presentation with segmented toggle between Software Development and Music.
 */
export function WorksPresentation() {
  const controller = useWorksController();
  const theme = useTheme();

  return (
    <S.SectionWrapper theme={theme} id="Works">
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

      <S.ContentArea>
        <Show when={controller.activeSegment.value === "software"}>
          <WorksCarousel projects={controller.projectsQuery.data ?? []} />
        </Show>

        <Show when={controller.activeSegment.value === "music"}>
          <Box>
            <S.PlaceholderWrapper>
              <S.PlaceholderTitle theme={theme}>Coming Soon</S.PlaceholderTitle>
              <S.PlaceholderDescription theme={theme}>
                Music compositions and arrangements are being prepared. Check
                back soon for updates.
              </S.PlaceholderDescription>
            </S.PlaceholderWrapper>
          </Box>
        </Show>
      </S.ContentArea>
    </S.SectionWrapper>
  );
}
