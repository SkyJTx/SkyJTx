import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

interface BrandTitleProps {
  children: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
}

const StyledBrandTitle = styled("h1")<{ theme: Theme }>`
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.text} 0%,
    ${(p) => p.theme.colors.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.05em;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export function BrandTitle(props: BrandTitleProps) {
  const theme = useTheme();

  return (
    <StyledBrandTitle
      theme={theme}
      style={props.style}
      class={props.class}
    >
      {props.children}
    </StyledBrandTitle>
  );
}
