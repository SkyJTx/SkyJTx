import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

export const PlaceholderWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

export const PlaceholderTitle = styled("div")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize["2xl"]};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

export const PlaceholderDescription = styled("p")<{ theme: Theme }>`
  margin: 0;
  color: ${(p) => p.theme.colors.muted};
  font-size: ${(p) => p.theme.typography.fontSize.base};
  max-width: 400px;
  line-height: ${(p) => p.theme.typography.lineHeight.relaxed};
  font-family: ${(p) => p.theme.typography.fontFamily};
`;
