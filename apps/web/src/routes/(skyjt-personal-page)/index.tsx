import { Switch, Match } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Box } from "~/components/Box";
import { useNavigationRepo } from "~/components/NavigationBar/index";
import { Theme } from "~/components/ThemeComponents/types";
import { useThemeController } from "~/components/ThemeComponents/index";
import { useWatch } from "@skyjt/signals-solid";

const ContentContainer = styled("div")`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeroContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1.5rem;
  margin-top: 2rem;
`;

const LogoWrapper = styled("div")<{ theme: Theme }>`
  width: 220px;
  height: 220px;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    transform: scale(1.05);
  }
`;

const BrandTitle = styled("h1")<{ theme: Theme }>`
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.text} 0%,
    ${(props) => props.theme.colors.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.05em;
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

const BrandSubtitle = styled("p")<{ theme: Theme }>`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.muted};
  max-width: 500px;
  margin-top: 0.75rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

export default function Home() {
  const repo = useNavigationRepo<string>();
  const controller = useThemeController();
  const theme = useTheme() as Theme;

  useWatch(
    () => repo.activeMenu,
    () => {
      console.log('activeMenu', repo.activeMenu);
    }
  );

  const logoSrc = () => controller.resolvedTheme.value === "dark" ? "/icon-dark.svg" : "/icon-light.svg";

  return (
    <ContentContainer>
      <Switch>
        <Match when={repo.activeMenu === "Overview"}>
          <HeroContainer>
            <LogoWrapper theme={theme}>
              <img
                src={logoSrc()}
                alt="SkyJT Logo"
                style={{ width: "100%", height: "100%" }}
              />
            </LogoWrapper>
            <BrandTitle theme={theme}>SkyJT</BrandTitle>
            <BrandSubtitle theme={theme}>
              A harmonious intersection of fluid design and music notation, styled with premium neumorphic details.
            </BrandSubtitle>
          </HeroContainer>
        </Match>
        
        <Match when={repo.activeMenu === "Documentation"}>
          <Box margin="2rem 0">
            <h2 style={{ margin: "0 0 1rem 0" }}>Documentation</h2>
            <p style={{ color: theme.colors.muted, margin: 0 }}>
              Explore comprehensive documentation on our package ecosystem and design principles.
            </p>
          </Box>
        </Match>
        
        <Match when={repo.activeMenu === "Packages"}>
          <Box margin="2rem 0">
            <h2 style={{ margin: "0 0 1rem 0" }}>Packages</h2>
            <p style={{ color: theme.colors.muted, margin: 0 }}>
              Discover our open-source tools and signals libraries.
            </p>
          </Box>
        </Match>
        
        <Match when={repo.activeMenu === "Settings"}>
          <Box margin="2rem 0">
            <h2 style={{ margin: "0 0 1rem 0" }}>Settings</h2>
            <p style={{ color: theme.colors.muted, margin: 0 }}>
              Customize your environment settings and color theme modes.
            </p>
          </Box>
        </Match>
      </Switch>
    </ContentContainer>
  );
}
