import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const CardContainer = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const MediaSection = styled("div")`
  flex-shrink: 0;
`;

export const ContentSection = styled("div")`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.25rem 0.25rem 0.25rem;
`;

export const CardTitle = styled("h3")<{ theme: Theme }>`
  margin: 0 0 0.5rem;
  font-size: ${(p) => p.theme.typography.fontSize.lg};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  font-family: ${(p) => p.theme.typography.fontFamily};
  line-height: 1.3;
`;

export const CardDescription = styled("p")<{ theme: Theme }>`
  margin: 0 0 1rem;
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  color: ${(p) => p.theme.colors.muted};
  line-height: ${(p) => p.theme.typography.lineHeight.relaxed};
  font-family: ${(p) => p.theme.typography.fontFamily};
  flex: 1;
`;

export const LinksRow = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

export const LinkButton = styled("a")<{ theme: Theme }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.35rem 0.85rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.5)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.full};
  text-decoration: none;
  transition: all ${(p) => p.theme.transitions.fast};
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${(p) => withOpacity(p.theme.colors.primary, 0.15)};
  }
`;
