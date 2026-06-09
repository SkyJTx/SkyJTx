import { useComputed } from "@skyjt/signals-solid";
import { styled, useTheme } from "solid-styled-components";
import { Logo, BrandTitle, BrandSubtitle } from "~/components/Brand";
import { useThemeController } from "~/components/ThemeComponents";
import { useNavigationRepo } from "~/components/NavigationBar";
import { Box } from "~/components/Box";
import { Button } from "~/components/Button";
import { SocialLinks } from "~/components/SocialLinks";
import { Theme } from "~/components/ThemeComponents/types";

const HomeWrapper = styled("section")<{ theme: Theme }>`
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

const HeroContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
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

const LogoWrapper = styled("div")`
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 8px 24px rgba(56, 189, 248, 0.15));
`;

const Greeting = styled("span")<{ theme: Theme }>`
  font-size: 0.875rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
`;

const Description = styled("p")<{ theme: Theme }>`
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  max-width: 600px;
  margin-top: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const ButtonGroup = styled("div")`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const FocusGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  height: 100%;
`;

const CardIconWrapper = styled("div")<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.primary}15;
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 1.25rem;
`;

const CardTitle = styled("h3")<{ theme: Theme }>`
  font-size: 1.25rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 0.5rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const CardDescription = styled("p")<{ theme: Theme }>`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const DesignIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M12 2V12L17 17" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const AudioIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

/**
 * The primary landing/home page presentation for the personal portfolio.
 */
export function HomePresentation() {
  const theme = useTheme() as Theme;
  const controller = useThemeController();
  const repo = useNavigationRepo<string>();

  const logoSrc = useComputed(() => {
    const r = controller.resolvedTheme();
    if (r === "dark") {
      return "/icon-dark.svg";
    }
    return "/icon-light.svg";
  });

  const handleExploreProjects = () => {
    try {
      repo.setActiveMenu("Works");
    } catch (error) {
      console.error("Navigation error", error);
    }
  };

  const handleContactMe = () => {
    try {
      repo.setActiveMenu("Contacts");
    } catch (error) {
      console.error("Navigation error", error);
    }
  };

  return (
    <HomeWrapper id="Home" theme={theme}>
      <HeroContainer>
        <LogoWrapper>
          <Logo src={logoSrc} alt="SkyJT Logo" size="140px" />
        </LogoWrapper>
        <Greeting theme={theme}>Welcome to my space</Greeting>
        <BrandTitle>SkyJT</BrandTitle>
        <BrandSubtitle>Creative Engineer & Audio Developer</BrandSubtitle>
        <Description theme={theme}>
          Designing and building high-performance web architectures, interactive
          media interfaces, and digital acoustic visualizers with pixel-perfect precision.
        </Description>
        <ButtonGroup>
          <Button variant="primary" onClick={handleExploreProjects}>
            Explore Projects
          </Button>
          <Button variant="secondary" onClick={handleContactMe}>
            Get In Touch
          </Button>
        </ButtonGroup>
        <SocialLinks />
      </HeroContainer>

      <FocusGrid>
        <Box>
          <CardContent>
            <CardIconWrapper theme={theme}>
              <CodeIcon />
            </CardIconWrapper>
            <CardTitle theme={theme}>Frontend Architecture</CardTitle>
            <CardDescription theme={theme}>
              Developing robust web structures using reactive primitives, solid type
              safety, and optimized state synchronization.
            </CardDescription>
          </CardContent>
        </Box>
        <Box>
          <CardContent>
            <CardIconWrapper theme={theme}>
              <DesignIcon />
            </CardIconWrapper>
            <CardTitle theme={theme}>Creative Design</CardTitle>
            <CardDescription theme={theme}>
              Sculpting modern layouts with liquid glass aesthetics, immersive
              animations, and responsive micro-interactions.
            </CardDescription>
          </CardContent>
        </Box>
        <Box>
          <CardContent>
            <CardIconWrapper theme={theme}>
              <AudioIcon />
            </CardIconWrapper>
            <CardTitle theme={theme}>Acoustic & Audio Tech</CardTitle>
            <CardDescription theme={theme}>
              Creating digital music technologies, interactive synthesizers, and Web
              Audio soundscapes.
            </CardDescription>
          </CardContent>
        </Box>
      </FocusGrid>
    </HomeWrapper>
  );
}
