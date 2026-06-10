import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export interface BoxProps {
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
  margin?: string | number;
  padding?: string | number;
  boxRadius?: string;
  fitContent?: boolean;
  blur?: string;
}

export const StyledBox = styled("div")<{
  theme: Theme;
  $margin?: string | number;
  $padding?: string | number;
  $boxRadius?: string;
  $fitContent?: boolean;
  $blur?: string;
}>`
  background: linear-gradient(
    135deg,
    ${(props) => withOpacity(props.theme.colors.surface, 0.8)} 0%,
    ${(props) => withOpacity(props.theme.colors.background, 0.5)} 100%
  );
  backdrop-filter: blur(${(props) => props.$blur ?? "18px"}) saturate(160%);
  -webkit-backdrop-filter: blur(${(props) => props.$blur ?? "18px"}) saturate(160%);
  border-radius: ${(props) => props.$boxRadius ?? props.theme.radii.lg};
  border: 1px solid ${(props) => props.theme.colors.border};

  box-shadow:
    inset 0 0 6px ${(props) => withOpacity(props.theme.colors.primary, 0.6)},
    0 0 100px ${(props) => withOpacity(props.theme.colors.secondary, 0.13)};

  ${(props) => (props.$padding !== undefined ? `padding: ${props.$padding};` : `padding: ${props.theme.spacing.lg};`)}
  ${(props) => (props.$margin !== undefined ? `margin: ${props.$margin};` : "")}
  ${(props) => (props.$fitContent ? "width: fit-content;" : "")}
  color: ${(props) => props.theme.colors.text};
  transition: ${(props) => props.theme.transitions.normal};

  &:hover {
    box-shadow:
      inset 0 0 8px ${(props) => withOpacity(props.theme.colors.primary, 0.8)},
      0 4px 20px ${(props) => withOpacity(props.theme.colors.secondary, 0.27)};
    transform: translateY(-2px);
  }
`;

export function Box(props: BoxProps) {
  const theme = useTheme();

  return (
    <StyledBox
      theme={theme}
      class={props.class}
      style={props.style}
      $margin={props.margin}
      $padding={props.padding}
      $boxRadius={props.boxRadius}
      $fitContent={props.fitContent}
      $blur={props.blur}
    >
      {props.children}
    </StyledBox>
  );
}
