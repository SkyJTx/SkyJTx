import { For, JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { useNavigationRepo } from "./NavigationContext";
import { Theme } from "~/theme/types";

interface NavigationMenuProps<T> {
  items: T[];
  children: (
    item: T,
    isActive: () => boolean,
    onClick: () => void,
  ) => JSX.Element;
}

const MenuContainer = styled("div")<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const MenuItemWrapper = styled("div")<{ theme: Theme; active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${(props) => (props.active ? "100%" : "0%")};
    background: linear-gradient(
      to top,
      ${(props) => props.theme.colors.primary}20 0%,
      transparent 100%
    );
    opacity: ${(props) => (props.active ? 1 : 0)};
    transition: all ${(props) => props.theme.transitions.normal};
    pointer-events: none;
    border-radius: ${(props) => props.theme.radii.sm};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${(props) => (props.active ? "80%" : "0%")};
    height: 3px;
    background: ${(props) => props.theme.colors.primary};
    border-radius: ${(props) => props.theme.radii.full};
    box-shadow:
      0 0 10px ${(props) => props.theme.colors.primary},
      0 0 20px ${(props) => props.theme.colors.primary}aa;
    transition: all ${(props) => props.theme.transitions.normal};
    pointer-events: none;
  }
`;

export function NavigationMenu<T>(props: NavigationMenuProps<T>) {
  const repo = useNavigationRepo<T>();
  const theme = useTheme() as Theme;

  return (
    <MenuContainer theme={theme}>
      <For each={props.items}>
        {(item) => {
          const isActive = () => repo.activeMenu === item;
          const onClick = () => repo.setActiveMenu(item);

          return (
            <MenuItemWrapper theme={theme} active={isActive()}>
              {props.children(item, isActive, onClick)}
            </MenuItemWrapper>
          );
        }}
      </For>
    </MenuContainer>
  );
}
