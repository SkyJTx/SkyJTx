import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

interface BrandTitleProps {
  children: JSX.Element;
}

const StyledBrandTitle = styled("h1")<{ theme: Theme }>`
  font-size: 3rem;
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
  const theme = useTheme() as Theme;

  return (
    <StyledBrandTitle theme={theme}>
      {props.children}
    </StyledBrandTitle>
  );
}
