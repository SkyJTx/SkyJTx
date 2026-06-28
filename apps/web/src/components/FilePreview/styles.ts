import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const Backdrop = styled("div")<{ theme: Theme }>`
  position: fixed;
  inset: 0;
  z-index: ${(p) => p.theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  background: ${(p) => withOpacity(p.theme.colors.background, 0.75)};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  animation: filePreviewFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes filePreviewFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Header = styled("header")<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.4)};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 10;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
  }
`;

export const MetaSection = styled("div")`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0; /* allows text truncation */
`;

export const IconContainer = styled("div")<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => withOpacity(p.theme.colors.primary, 0.1)};
  color: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
`;

export const TextContainer = styled("div")`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FileName = styled("h2")<{ theme: Theme }>`
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.base};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FileDate = styled("span")<{ theme: Theme }>`
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.normal};
  color: ${(p) => p.theme.colors.muted};
  margin-top: 0.15rem;
`;

export const ActionsSection = styled("div")`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

export const Viewport = styled("div")`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 1.5rem;
  box-sizing: border-box;
  width: 100%;
  position: relative;

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const ImageWrapper = styled("div")`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 80vh;
  animation: filePreviewScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes filePreviewScaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const Image = styled("img")<{ theme: Theme }>`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: ${(p) => p.theme.radii.lg};
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: ${(p) => p.theme.shadows.lg};
  user-select: none;
  -webkit-user-drag: none;
  background: ${(p) => p.theme.colors.surface};
`;

export const PdfWrapper = styled("div")<{ theme: Theme }>`
  width: 100%;
  height: 100%;
  max-width: 1000px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  box-shadow: ${(p) => p.theme.shadows.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: filePreviewScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const PdfIframe = styled("iframe")`
  width: 100%;
  height: 100%;
  border: none;
  flex-grow: 1;
`;

export const Toast = styled("div")<{ theme: Theme }>`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.success};
  color: ${(p) => p.theme.colors.text};
  padding: 0.6rem 1.2rem;
  border-radius: ${(p) => p.theme.radii.md};
  box-shadow: ${(p) => p.theme.shadows.md};
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 20;
  animation: toastFadeInOut 2s ease-in-out forwards;

  @keyframes toastFadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, 1rem);
    }
    15% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    85% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -1rem);
    }
  }
`;
