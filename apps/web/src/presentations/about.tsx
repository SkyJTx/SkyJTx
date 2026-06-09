import { styled, useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Theme } from "~/components/ThemeComponents/types";

const SectionWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
  min-height: 100vh;
  padding: 8rem 2rem 4rem 2rem;
  box-sizing: border-box;
`;

const ContentBox = styled("div")`
  width: 100%;
  margin-top: 2rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TextParagraph = styled("p")<{ theme: Theme }>`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 1.5rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

/**
 * About section presentation.
 */
export function AboutPresentation() {
  const theme = useTheme() as Theme;

  return (
    <SectionWrapper id="About" theme={theme}>
      <BrandTitle>About Me</BrandTitle>
      <BrandSubtitle>My journey, philosophy, and background</BrandSubtitle>

      <ContentBox>
        <Box>
          <TextParagraph theme={theme}>
            Hello! I'm SkyJT, a software engineer and designer dedicated to
            building clean, interactive, and high-performance applications.
            My passion lies at the intersection of robust frontend engineering,
            creative layouts, and digital audio signal processing.
          </TextParagraph>
          <TextParagraph theme={theme}>
            With a strong focus on modular code architectures, performance tuning,
            and reactive patterns, I strive to make the web feel fast, fluid, and
            visually breathtaking.
          </TextParagraph>
        </Box>
      </ContentBox>
    </SectionWrapper>
  );
}
