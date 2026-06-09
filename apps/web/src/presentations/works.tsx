import { styled, useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Button } from "~/components/Button";
import { Theme } from "~/components/ThemeComponents/types";

const SectionWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  padding: 8rem 2rem 4rem 2rem;
  box-sizing: border-box;
`;

const ProjectGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 3rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardLayout = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ProjectInfo = styled("div")`
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled("h3")<{ theme: Theme }>`
  font-size: 1.25rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 0.5rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const ProjectDescription = styled("p")<{ theme: Theme }>`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const TagList = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const TechTag = styled("span")<{ theme: Theme }>`
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: ${(p) => p.theme.radii.full};
  background: ${(p) => p.theme.colors.primary}15;
  color: ${(p) => p.theme.colors.primary};
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

/**
 * Works presentation highlighting recent engineering and acoustic projects.
 */
export function WorksPresentation() {
  const theme = useTheme() as Theme;

  return (
    <SectionWrapper id="Works" theme={theme}>
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

      <ProjectGrid>
        <Box>
          <CardLayout>
            <ProjectInfo>
              <ProjectTitle theme={theme}>SkyJTx Platform</ProjectTitle>
              <ProjectDescription theme={theme}>
                A high-speed reactive rendering toolset engineered with customizable signal structures and a minimal runtime overhead.
              </ProjectDescription>
              <TagList>
                <TechTag theme={theme}>SolidJS</TechTag>
                <TechTag theme={theme}>TypeScript</TechTag>
                <TechTag theme={theme}>Reactive Signals</TechTag>
              </TagList>
            </ProjectInfo>
            <Button variant="secondary" onClick={() => window.open("https://github.com", "_blank")}>
              View Repository
            </Button>
          </CardLayout>
        </Box>

        <Box>
          <CardLayout>
            <ProjectInfo>
              <ProjectTitle theme={theme}>Waveform Synthesizer</ProjectTitle>
              <ProjectDescription theme={theme}>
                Interactive digital audio workstation using the Web Audio API to model and render synthesis, filters, and dynamic wave shapes in real-time.
              </ProjectDescription>
              <TagList>
                <TechTag theme={theme}>Web Audio API</TechTag>
                <TechTag theme={theme}>Canvas 2D</TechTag>
                <TechTag theme={theme}>TypeScript</TechTag>
              </TagList>
            </ProjectInfo>
            <Button variant="secondary" onClick={() => window.open("https://github.com", "_blank")}>
              Launch Experiment
            </Button>
          </CardLayout>
        </Box>
      </ProjectGrid>
    </SectionWrapper>
  );
}
