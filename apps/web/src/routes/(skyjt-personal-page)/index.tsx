import { Switch, Match } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Box } from "~/components/Box";
import { useNavigationRepo } from "~/components/NavigationBar/index";
import { Theme } from "~/components/ThemeComponents/types";
import { useThemeController } from "~/components/ThemeComponents/index";

const ContentContainer = styled("div")`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SettingsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ThemeButtonGroup = styled("div")`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ThemeOptionButton = styled("button")<{ theme: Theme; active: boolean }>`
  background: ${(props) => (props.active ? `${props.theme.colors.primary}20` : "transparent")};
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text)};
  border: 1px solid ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.border)};
  padding: 0.75rem 1.5rem;
  border-radius: ${(props) => props.theme.radii.md};
  font-family: ${(props) => props.theme.typography.fontFamily};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${(props) => (props.active ? `0 0 12px ${props.theme.colors.primary}33` : "none")};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default function Home() {
  const repo = useNavigationRepo<string>();
  const theme = useTheme() as Theme;
  const themeController = useThemeController();

  return (
    <ContentContainer>
      <Box>
        <Switch>
          <Match when={repo.activeMenu === "Overview"}>
            <h2 class="text-2xl font-bold mb-2">Overview Dashboard</h2>
            <p class="text-gray-500">
              Welcome to the Reactivity Studio dashboard. You are viewing the custom liquid glass NavigationBar showcase.
            </p>
          </Match>
          <Match when={repo.activeMenu === "Documentation"}>
            <h2 class="text-2xl font-bold mb-2">Documentation</h2>
            <p class="text-gray-500">
              Read comprehensive guides on custom reactivity, signals, and store hydration designed for SolidJS apps.
            </p>
          </Match>
          <Match when={repo.activeMenu === "Packages"}>
            <h2 class="text-2xl font-bold mb-2">Packages Suite</h2>
            <p class="text-gray-500">
              Explore packages like @skyjt/signals-solid, @skyjt/store-solid, and @skyjt/query-solid.
            </p>
          </Match>
          <Match when={repo.activeMenu === "Settings"}>
            <h2 class="text-2xl font-bold mb-2">System Settings</h2>
            <p class="text-gray-500">
              Configure display, themes, and hydration options for the web client.
            </p>
            <SettingsContainer>
              <div>
                <h3 class="text-lg font-semibold mb-2" style={{ color: theme.colors.text }}>Theme Mode</h3>
                <p class="text-sm text-gray-500 mb-3" style={{ color: theme.colors.muted }}>
                  Choose how Reactivity Studio looks on your device.
                </p>
                <ThemeButtonGroup>
                  <ThemeOptionButton
                    theme={theme}
                    active={themeController.mode === "light"}
                    onClick={() => {
                      themeController.mode = "light";
                    }}
                  >
                    <span>🌞 Light</span>
                  </ThemeOptionButton>
                  <ThemeOptionButton
                    theme={theme}
                    active={themeController.mode === "dark"}
                    onClick={() => {
                      themeController.mode = "dark";
                    }}
                  >
                    <span>🌙 Dark</span>
                  </ThemeOptionButton>
                  <ThemeOptionButton
                    theme={theme}
                    active={themeController.mode === "system"}
                    onClick={() => {
                      themeController.mode = "system";
                    }}
                  >
                    <span>💻 System</span>
                  </ThemeOptionButton>
                </ThemeButtonGroup>
              </div>
            </SettingsContainer>
          </Match>
        </Switch>
      </Box>
    </ContentContainer>
  );
}
