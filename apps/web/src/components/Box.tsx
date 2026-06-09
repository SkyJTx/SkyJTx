import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

export interface BoxProps {
  children: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
  margin?: string | number;
  padding?: string | number;
  boxRadius?: string;
  fitContent?: boolean;
}

export const StyledBox = styled("div")<{
  theme: Theme;
  $margin?: string | number;
  $padding?: string | number;
  $boxRadius?: string;
  $fitContent?: boolean;
}>`
  /* Liquid Glass base */
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.surface}cc 0%,
    ${(props) => props.theme.colors.background}80 100%
  );
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-radius: ${(props) => props.$boxRadius ?? props.theme.radii.lg};
  border: 1px solid ${(props) => props.theme.colors.border};

  /* Subtle glow instead of heavy shadow */
  box-shadow:
    inset 0 0 6px ${(props) => props.theme.colors.primary}99,
    0 0 100px ${(props) => props.theme.colors.secondary}22;

  /* Layout tokens */
  ${(props) => (props.$padding !== undefined ? `padding: ${props.$padding};` : `padding: ${props.theme.spacing.lg};`)}
  ${(props) => (props.$margin !== undefined ? `margin: ${props.$margin};` : "")}
  ${(props) => (props.$fitContent ? "width: fit-content;" : "")}
  color: ${(props) => props.theme.colors.text};
  transition: ${(props) => props.theme.transitions.normal};

  /* Hover effect: gentle lift */
  &:hover {
    box-shadow:
      inset 0 0 8px ${(props) => props.theme.colors.primary}cc,
      0 4px 20px ${(props) => props.theme.colors.secondary}44;
    transform: translateY(-2px);
  }
`;

export function Box(props: BoxProps) {
  const theme = useTheme() as Theme;

  return (
    <StyledBox
      theme={theme}
      class={props.class}
      style={props.style}
      $margin={props.margin}
      $padding={props.padding}
      $boxRadius={props.boxRadius}
      $fitContent={props.fitContent}
    >
      {props.children}
    </StyledBox>
  );
}

