import { RouteSectionProps } from "@solidjs/router";
import { styled, useTheme } from "solid-styled-components";
import { Background } from "~/components/Background";
import {
  NavigationProvider,
  NavigationBar,
  NavigationMenu,
} from "~/components/NavigationBar/index";
import { Theme } from "~/components/ThemeComponents/types";
import { ThemeToggler } from "~/components/ThemeComponents/index";


const PageContainer = styled("div")`
  width: 100%;
  z-index: 1;
`;

const ActionsContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  text-shadow: ${(props) => (props.active ? "0.5px 0 0 currentColor" : "none")};


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
                    onClick={() => {
                      onClick();
                      if (typeof window !== "undefined") {
                        (window as any).isScrollingToSection = true;
                        const element = document.getElementById(item);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                        setTimeout(() => {
                          (window as any).isScrollingToSection = false;
                        }, 800);
                      }
                    }}
                  >
                    <span>{item}</span>
                  </CustomTabButton>
                )}
              </NavigationMenu>
            }
            action={
              <ActionsContainer>
                <ThemeToggler />
              </ActionsContainer>
            }

          />
          {props.children}
        </PageContainer>
      </NavigationProvider>
    </Background>
  );
}
