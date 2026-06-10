import { For, JSX, Show } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { useNavigationRepo } from "./NavigationContext";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";


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

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const MenuItemWrapper = styled("div")<{ theme: Theme; active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform ${(props) => props.theme.transitions.normal};

  &:hover {
    transform: scale(1.05);
    z-index: 10;
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${(props) => (props.active ? "100%" : "0%")};
    background: linear-gradient(
      to top,
      ${(props) => withOpacity(props.theme.colors.primary, 0.125)} 0%,
      transparent 100%
    );
    opacity: ${(props) => (props.active ? 1 : 0)};
    transition: all ${(props) => props.theme.transitions.normal};
    pointer-events: none;
    border-radius: ${(props) => props.theme.radii.sm};
  }
`;

const ActiveVIndicator = styled("div")<{ theme: Theme }>`
  position: absolute;
  bottom: -0.4rem;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 60px;
  height: 12px;
  pointer-events: none;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  animation: enter-v 0.2s ease-out forwards;

  @keyframes enter-v {
    from {
      opacity: 0;
      transform: translate(-50%, calc(50% - 4px)) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 50%) scale(1);
    }
  }
`;

const CenterV = styled("svg")<{ theme: Theme }>`
  width: 60px;
  height: 12px;
  flex-shrink: 0;
  overflow: visible;

  .fill-path {
    fill: ${(props) => props.theme.colors.background};
    opacity: 0.95;
  }

  .border-path {
    stroke: ${(props) => props.theme.colors.border};
    stroke-width: 1px;
    fill: none;
  }

  .glow-path {
    stroke: ${(props) => props.theme.colors.primary};
    stroke-width: 2px;
    fill: none;
    filter: drop-shadow(0 0 4px ${(props) => props.theme.colors.primary});
    opacity: 0.85;
    animation: radiate-pulse 2s infinite ease-in-out;
  }

  @keyframes radiate-pulse {
    0% {
      opacity: 0.5;
      filter: drop-shadow(0 0 2px ${(props) => props.theme.colors.primary});
    }
    50% {
      opacity: 1;
      filter: drop-shadow(0 0 6px ${(props) => props.theme.colors.primary});
    }
    100% {
      opacity: 0.5;
      filter: drop-shadow(0 0 2px ${(props) => props.theme.colors.primary});
    }
  }
`;

const GlowRadial = styled("div")<{ theme: Theme }>`
  position: absolute;
  left: 50%;
  bottom: -15px;
  transform: translateX(-50%);
  width: 100px;
  height: 30px;
  background: radial-gradient(
    circle,
    ${(props) => withOpacity(props.theme.colors.primary, 0.25)} 0%,
    transparent 70%
  );
  filter: blur(6px);
  pointer-events: none;
  z-index: -1;
`;

export function NavigationMenu<T>(props: NavigationMenuProps<T>) {
  const repo = useNavigationRepo<T>();
  const theme = useTheme();

  return (
    <MenuContainer theme={theme}>
      <For each={props.items}>
        {(item) => {
          const isActive = () => repo.activeMenu === item;
          const onClick = () => repo.setActiveMenu(item);

          return (
            <MenuItemWrapper theme={theme} active={isActive()}>
              {props.children(item, isActive, onClick)}
              <Show when={isActive()}>
                <ActiveVIndicator theme={theme}>
                  <CenterV theme={theme} viewBox="0 0 60 12">
                    <path class="fill-path" d="M 0,0 L 20,0 L 30,10 L 40,0 L 60,0 L 60,-2 L 0,-2 Z" />
                    <path class="border-path" d="M 0,0 L 20,0 L 30,10 L 40,0 L 60,0" />
                    <path class="glow-path" d="M 20,0 L 30,10 L 40,0" />
                  </CenterV>
                  <GlowRadial theme={theme} />
                </ActiveVIndicator>
              </Show>
            </MenuItemWrapper>
          );
        }}
      </For>
    </MenuContainer>
  );
}
