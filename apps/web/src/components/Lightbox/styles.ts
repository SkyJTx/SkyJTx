import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const Overlay = styled("div")<{ theme: Theme }>`
  position: fixed;
  inset: 0;
  z-index: ${(p) => p.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => withOpacity(p.theme.colors.background, 0.85)};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: lightboxFadeIn 0.2s ease-out;
  cursor: zoom-out;

  @keyframes lightboxFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ImageContainer = styled("div")`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
  animation: lightboxScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes lightboxScaleIn {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const LightboxImage = styled("img")`
  display: block;
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  user-select: none;
  -webkit-user-drag: none;
`;

export const CloseButton = styled("button")<{ theme: Theme }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.6)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.full};
  color: ${(p) => p.theme.colors.text};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  padding: 0;

  &:hover {
    background: ${(p) => withOpacity(p.theme.colors.primary, 0.15)};
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;
