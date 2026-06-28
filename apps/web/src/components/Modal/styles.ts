import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const Backdrop = styled("div")<{ theme: Theme; variant?: "default" | "lightbox" }>`
  position: fixed;
  inset: 0;
  z-index: ${(p) => p.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) =>
    p.variant === "lightbox"
      ? withOpacity(p.theme.colors.background, 0.85)
      : "rgba(0, 0, 0, 0.75)"};
  backdrop-filter: ${(p) => (p.variant === "lightbox" ? "blur(16px)" : "blur(12px)")};
  -webkit-backdrop-filter: ${(p) =>
    p.variant === "lightbox" ? "blur(16px)" : "blur(12px)"};
  animation: ${(p) => (p.variant === "lightbox" ? "lightboxFadeIn" : "fadeIn")} 0.25s ease-out;
  cursor: ${(p) => (p.variant === "lightbox" ? "zoom-out" : "default")};

  @keyframes lightboxFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const LightboxContainer = styled("div")`
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

export const LightboxCloseButton = styled("button")<{ theme: Theme }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.65)};
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

export const ModalContainer = styled("div")<{ theme: Theme }>`
  position: relative;
  width: 90vw;
  height: 85vh;
  max-width: 1200px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes scaleUp {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled("div")<{ theme: Theme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

export const ModalTitle = styled("h3")<{ theme: Theme }>`
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
`;

export const HeaderCloseButton = styled("button")<{ theme: Theme }>`
  background: transparent;
  border: none;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => withOpacity(p.theme.colors.text, 0.1)};
  }
`;
