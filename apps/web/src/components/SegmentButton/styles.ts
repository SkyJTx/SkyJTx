import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const SegmentContainer = styled("div")<{ theme: Theme }>`
  display: inline-flex;
  position: relative;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.5)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.full};
  padding: 4px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

export const SegmentIndicator = styled("div")<{
  theme: Theme;
  $offset: number;
  $width: number;
}>`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${(p) => p.$offset}px;
  width: ${(p) => p.$width}px;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary} 0%,
    ${(p) => p.theme.colors.secondary} 100%
  );
  border-radius: ${(p) => p.theme.radii.full};
  transition: left ${(p) => p.theme.transitions.normal},
    width ${(p) => p.theme.transitions.normal};
  box-shadow: 0 2px 8px ${(p) => withOpacity(p.theme.colors.primary, 0.3)};
`;

export const SegmentItem = styled("button")<{
  theme: Theme;
  $active: boolean;
}>`
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  padding: 0.45rem 1.25rem;
  cursor: pointer;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  color: ${(p) => (p.$active ? "#ffffff" : p.theme.colors.muted)};
  transition: color ${(p) => p.theme.transitions.fast};
  white-space: nowrap;
  user-select: none;
  outline: none;

  &:hover {
    color: ${(p) => (p.$active ? "#ffffff" : p.theme.colors.text)};
  }

  @media (max-width: 480px) {
    padding: 0.35rem 0.9rem;
    font-size: ${(p) => p.theme.typography.fontSize.xs};
  }
`;
