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

export const CanvasWrapper = styled("div")`
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }

  canvas {
    display: block;
    max-width: 100%;
    object-fit: contain;
  }
`;

export const HoverOverlay = styled("div")<{ theme: Theme }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.4)};
  opacity: 0;
  transition: all ${(p) => p.theme.transitions.fast};
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);

  ${CanvasWrapper.class}:hover & {
    opacity: 1;
    background: ${(p) => withOpacity(p.theme.colors.surface, 0.7)};
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
`;

export const HoverText = styled("span")<{ theme: Theme }>`
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  color: ${(p) => p.theme.colors.text};
  letter-spacing: 0.5px;
`;

export const LoadingOverlay = styled("div")<{ theme: Theme }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.65)};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 5;
`;

export const Spinner = styled("div")<{ theme: Theme }>`
  width: 28px;
  height: 28px;
  border: 2px solid ${(p) => withOpacity(p.theme.colors.text, 0.15)};
  border-top-color: ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
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
export const ModalIframe = styled("iframe")`
  width: 100%;
  flex: 1;
  border: none;
  display: block;
  background: white;
`;
