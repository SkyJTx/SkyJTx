import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

interface ButtonProps {
  children: JSX.Element;
  onClick?: (event: MouseEvent) => void;
  variant?: "primary" | "secondary" | "text";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  class?: string;
  style?: JSX.CSSProperties;
}

const StyledButton = styled("button")<{
  theme: Theme;
  $variant: "primary" | "secondary" | "text";
}>`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  ${(p) => {
    if (p.$variant === "primary") {
      return `
        background: linear-gradient(
          135deg,
          ${p.theme.colors.primary} 0%,
          ${p.theme.colors.secondary} 100%
        );
        color: #ffffff;
        border: none;
        box-shadow: 0 4px 12px ${withOpacity(p.theme.colors.primary, 0.2)};

        &:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 20px ${withOpacity(p.theme.colors.primary, 0.33)},
            0 0 12px ${withOpacity(p.theme.colors.secondary, 0.27)};
        }

        &:active {
          transform: translateY(-1px);
        }
      `;
    }

    if (p.$variant === "secondary") {
      return `
        background: linear-gradient(
          135deg,
          ${withOpacity(p.theme.colors.surface, 0.8)} 0%,
          ${withOpacity(p.theme.colors.background, 0.5)} 100%
        );
        color: ${p.theme.colors.text};
        border: 1px solid ${p.theme.colors.border};
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);

        &:hover {
          border-color: ${p.theme.colors.primary};
          color: ${p.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${withOpacity(p.theme.colors.primary, 0.13)};
        }

        &:active {
          transform: translateY(-1px);
        }
      `;
    }

    return `
      background: transparent;
      color: ${p.theme.colors.text};
      border: none;
      padding-left: 0.5rem;
      padding-right: 0.5rem;

      &:hover {
        color: ${p.theme.colors.primary};
        transform: translateY(-1px);
      }
    `;
  }}
`;

/**
 * A reusable, premium styled button component.
 */
export function Button(props: ButtonProps) {
  const theme = useTheme();
  const variant = props.variant ?? "secondary";

  return (
    <StyledButton
      theme={theme}
      $variant={variant}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      class={props.class}
      style={props.style}
    >
      {props.children}
    </StyledButton>
  );
}
