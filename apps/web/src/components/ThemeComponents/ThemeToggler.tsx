import { styled, useTheme } from "solid-styled-components";
import { Theme } from "./types";
import { useThemeController } from "./ThemeController";
import { Switch, Match } from "solid-js";
import { withOpacity } from "./utils";

const TogglerButton = styled("button")<{ theme: Theme }>`
  background: linear-gradient(
    135deg,
    ${(props) => withOpacity(props.theme.colors.surface, 0.8)} 0%,
    ${(props) => withOpacity(props.theme.colors.background, 0.5)} 100%
  );
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md};
  color: ${(props) => props.theme.colors.text};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all ${(props) => props.theme.transitions.fast};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${(props) => withOpacity(props.theme.colors.primary, 0.2)};
  }


  &:active {
    transform: translateY(0);
  }
`;

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

/**
 * A beautiful toggler button component that cycles theme mode between light, dark, and system.
 */
export function ThemeToggler() {
  const theme = useTheme();
  const controller = useThemeController();

  const handleToggle = () => {
    try {
      controller.toggle();
    } catch (error) {
      console.error("Failed to toggle theme", error);
    }
  };

  const getTitle = () => {
    const mode = controller.mode;
    if (mode === "light") return "Theme: Light (click to change)";
    if (mode === "dark") return "Theme: Dark (click to change)";
    return "Theme: System (click to change)";
  };

  return (
    <TogglerButton
      theme={theme}
      onClick={handleToggle}
      title={getTitle()}
      aria-label="Toggle theme mode"
    >
      <Switch>
        <Match when={controller.mode === "light"}>
          <SunIcon />
        </Match>
        <Match when={controller.mode === "dark"}>
          <MoonIcon />
        </Match>
        <Match when={controller.mode === "system"}>
          <MonitorIcon />
        </Match>
      </Switch>
    </TogglerButton>
  );
}
