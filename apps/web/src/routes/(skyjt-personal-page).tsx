import { RouteSectionProps } from "@solidjs/router";
import { styled, useTheme } from "solid-styled-components";
import { Background } from "~/components/Background";
import {
  NavigationProvider,
  NavigationBar,
  NavigationMenu,
} from "~/components/NavigationBar/index";
import { Theme } from "~/components/ThemeComponents/types";

const PageContainer = styled("div")`
  width: 100%;
  max-width: 1200px;
  padding: 2rem 1.5rem;
  z-index: 1;
`;

const ActionButton = styled("button")<{ theme: Theme }>`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  color: white;
  border: none;
  padding: 0.35rem 0.9rem;
  border-radius: ${(props) => props.theme.radii.md};
  font-family: ${(props) => props.theme.typography.fontFamily};
  font-size: 0.75rem;
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
  background: transparent;
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text)};
  border: none;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all ${(props) => props.theme.transitions.fast};
  font-size: 0.75rem;
  font-weight: ${(props) => (props.active ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.medium)};

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export default function PersonalPageLayout(props: RouteSectionProps) {
  const theme = useTheme() as Theme;
  const menus = ["Home", "About", "Works", "Contacts"];

  return (
    <Background>
      <NavigationProvider initialMenu="Home">
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
          {props.children}
        </PageContainer>
      </NavigationProvider>
    </Background>
  );
}
