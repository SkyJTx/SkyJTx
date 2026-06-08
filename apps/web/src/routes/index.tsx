import { Show, Switch, Match, onMount } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Background } from "~/components/Background";
import { Box } from "~/components/Box";
import {
  NavigationProvider,
  NavigationBar,
  NavigationMenu,
  useNavigationRepo,
} from "~/components/NavigationBar/index";
import { Theme } from "~/theme/types";
import { useSignal } from "@skyjt/signals-solid";

const PageContainer = styled("div")`
  width: 100%;
  max-width: 1200px;
  padding: 0 1.5rem;
  z-index: 1;
`;

const ContentContainer = styled("div")`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ActionButton = styled("button")<{ theme: Theme }>`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: ${(props) => props.theme.radii.md};
  font-family: ${(props) => props.theme.typography.fontFamily};
  font-size: ${(props) => props.theme.typography.fontSize.sm};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.fast};
  box-shadow: 0 4px 12px ${(props) => props.theme.colors.primary}44;

  &:hover {
    box-shadow: 0 6px 16px ${(props) => props.theme.colors.primary}66;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CustomTabButton = styled("button")<{ theme: Theme; active: boolean }>`
  background: ${(props) => (props.active ? `linear-gradient(135deg, ${props.theme.colors.primary}dd 0%, ${props.theme.colors.secondary}dd 100%)` : "transparent")};
  color: ${(props) => (props.active ? "white" : props.theme.colors.text)};
  border: 1px solid ${(props) => (props.active ? "transparent" : props.theme.colors.border)};
  padding: 0.4rem 0.8rem;
  border-radius: ${(props) => props.theme.radii.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    border-color: ${(props) => (props.active ? "transparent" : props.theme.colors.primary)};
    background: ${(props) => (props.active ? "" : `${props.theme.colors.surface}`)};
  }
`;

function MainContent() {
  const repo = useNavigationRepo<string>();
  const isMounted = useSignal(false);

  onMount(() => {
    isMounted.value = true;
  });

  return (
    <ContentContainer>
      <Box>
        <Show when={isMounted.value}>
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
            </Match>
          </Switch>
        </Show>
      </Box>
    </ContentContainer>
  );
}

export default function Home() {
  const theme = useTheme() as Theme;
  const menus = ["Overview", "Documentation", "Packages", "Settings"];

  return (
    <Background>
      <NavigationProvider initialMenu="Overview">
        <PageContainer>
          <NavigationBar
            menu={
              <NavigationMenu items={menus}>
                {(item, isActive, onClick) => (
                  <CustomTabButton
                    theme={theme}
                    active={isActive()}
                    onClick={onClick}
                  >
                    <span>{item}</span>
                  </CustomTabButton>
                )}
              </NavigationMenu>
            }
            action={<ActionButton theme={theme}>Get Started</ActionButton>}
          />
          <MainContent />
        </PageContainer>
      </NavigationProvider>
    </Background>
  );
}
