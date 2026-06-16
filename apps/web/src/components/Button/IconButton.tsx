import { JSX } from "solid-js";
import { css, useTheme } from "solid-styled-components";
import { Dynamic } from "solid-js/web";
import { useComputed } from "@skyjt/signals-solid";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/utils";


interface IconButtonProps {
  children: JSX.Element;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  class?: string;
  style?: JSX.CSSProperties;
  href?: string;
  target?: string;
  rel?: string;
  as?: "button" | "a";
  ariaLabel?: string;
  title?: string;
  size?: "sm" | "md" | "lg";
}

const getIconButtonClass = (theme: Theme, size: "sm" | "md" | "lg") => css`
  background: linear-gradient(
    135deg,
    ${withOpacity(theme.colors.surface, 0.8)} 0%,
    ${withOpacity(theme.colors.background, 0.5)} 100%
  );
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  color: ${theme.colors.text};
  width: ${size === "sm" ? "32px" : size === "lg" ? "44px" : "38px"};
  height: ${size === "sm" ? "32px" : size === "lg" ? "44px" : "38px"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all ${theme.transitions.fast};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  cursor: pointer;
  padding: 0;
  outline: none;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 
      0 4px 12px ${withOpacity(theme.colors.primary, 0.2)},
      inset 0 0 4px ${withOpacity(theme.colors.primary, 0.27)};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/**
 * A beautiful, glassmorphic icon-only button or anchor link.
 */
export function IconButton(props: IconButtonProps) {
  const theme = useTheme();
  const tag = useComputed(() => props.as || (props.href ? "a" : "button"));

  return (
    <Dynamic
      component={tag.value}
      class={`${getIconButtonClass(theme, props.size ?? "md")} ${props.class ?? ""}`}
      type={tag.value === "button" ? (props.type ?? "button") : undefined}
      disabled={props.disabled}
      href={props.href}
      target={props.target}
      rel={props.rel}
      onClick={props.onClick}
      style={props.style}
      aria-label={props.ariaLabel}
      title={props.title}
    >
      {props.children}
    </Dynamic>
  );
}
