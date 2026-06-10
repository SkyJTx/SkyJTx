import { useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Button } from "~/components/Button";
import { useWorksController } from "./works.controller";
import * as S from "./styles";

/**
 * Works presentation highlighting recent engineering and acoustic projects.
 */
export function WorksPresentation() {
  const c = useWorksController();
  const theme = useTheme();

  return (
    <S.SectionWrapper id="Works" theme={theme}>
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

      <S.ProjectGrid>
        <Box>
          <S.CardLayout>
            <S.ProjectInfo>
              <S.ProjectTitle theme={theme}>SkyJTx Platform</S.ProjectTitle>
              <S.ProjectDescription theme={theme}>
                A high-speed reactive rendering toolset engineered with customizable signal structures and a minimal runtime overhead.
              </S.ProjectDescription>
              <S.TagList>
                <S.TechTag theme={theme}>SolidJS</S.TechTag>
                <S.TechTag theme={theme}>TypeScript</S.TechTag>
                <S.TechTag theme={theme}>Reactive Signals</S.TechTag>
              </S.TagList>
            </S.ProjectInfo>
            <Button variant="secondary" onClick={() => c.handleOpenUrl("https://github.com")}>
              View Repository
            </Button>
          </S.CardLayout>
        </Box>

        <Box>
          <S.CardLayout>
            <S.ProjectInfo>
              <S.ProjectTitle theme={theme}>Waveform Synthesizer</S.ProjectTitle>
              <S.ProjectDescription theme={theme}>
                Interactive digital audio workstation using the Web Audio API to model and render synthesis, filters, and dynamic wave shapes in real-time.
              </S.ProjectDescription>
              <S.TagList>
                <S.TechTag theme={theme}>Web Audio API</S.TechTag>
                <S.TechTag theme={theme}>Canvas 2D</S.TechTag>
                <S.TechTag theme={theme}>TypeScript</S.TechTag>
              </S.TagList>
            </S.ProjectInfo>
            <Button variant="secondary" onClick={() => c.handleOpenUrl("https://github.com")}>
              Launch Experiment
            </Button>
          </S.CardLayout>
        </Box>
      </S.ProjectGrid>
    </S.SectionWrapper>
  );
}
