import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const PreviewContainer = styled("div")<{ theme: Theme }>`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.3)};
`;

export const IframeWrapper = styled("div")`
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

export const StyledIframe = styled("iframe")`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

export const FallbackContainer = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  gap: 12px;
  color: ${(p) => p.theme.colors.muted};

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

export const ViewButton = styled("a")<{ theme: Theme }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.5)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.full};
  text-decoration: none;
  transition: all ${(p) => p.theme.transitions.fast};
  cursor: pointer;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;
