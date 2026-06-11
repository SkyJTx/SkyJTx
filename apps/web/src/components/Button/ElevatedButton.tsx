import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

interface ElevatedButtonProps {
  children: JSX.Element;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  class?: string;
  style?: JSX.CSSProperties;
}

const StyledElevatedButton = styled("button")<{ theme: Theme }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  padding: 0.6rem 1.25rem;
  border-radius: ${(p) => p.theme.radii.md};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  user-select: none;
  text-decoration: none;
  outline: none;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary} 0%,
    ${(p) => p.theme.colors.secondary} 100%
  );
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px ${(p) => withOpacity(p.theme.colors.primary, 0.2)};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px ${(p) => withOpacity(p.theme.colors.primary, 0.33)},
      0 0 12px ${(p) => withOpacity(p.theme.colors.secondary, 0.27)};
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
`;

/**
 * A premium styled elevated button component.
 */
export function ElevatedButton(props: ElevatedButtonProps) {
  const theme = useTheme();

  return (
    <StyledElevatedButton
      theme={theme}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      class={props.class}
      style={props.style}
    >
      {props.children}
    </StyledElevatedButton>
  );
}
