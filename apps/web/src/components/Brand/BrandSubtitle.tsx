import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

interface BrandSubtitleProps {
  children: JSX.Element;
  maxWidth?: string;
  style?: JSX.CSSProperties;
  class?: string;
}

const StyledBrandSubtitle = styled("p")<{ theme: Theme; $maxWidth: string }>`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.muted};
  max-width: ${(p) => p.$maxWidth};
  margin-top: 0.75rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export function BrandSubtitle(props: BrandSubtitleProps) {
  const theme = useTheme();
  const maxWidth = props.maxWidth ?? "500px";

  return (
    <StyledBrandSubtitle
      theme={theme}
      $maxWidth={maxWidth}
      style={props.style}
      class={props.class}
    >
      {props.children}
    </StyledBrandSubtitle>
  );
}
