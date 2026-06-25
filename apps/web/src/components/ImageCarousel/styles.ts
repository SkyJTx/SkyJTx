import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const CarouselWrapper = styled("div")`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

export const CarouselTrack = styled("div")<{ $offset: number }>`
  display: flex;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(${(p) => p.$offset}%);
  will-change: transform;
`;

export const Slide = styled("div")`
  flex: 0 0 100%;
  min-width: 0;
`;

export const SlideImage = styled("img")<{theme: Theme}>`
  width: 100%;
  height: 260px;
  object-fit: contain;
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.45)};
  display: block;
  cursor: zoom-in;
  user-select: none;
  -webkit-user-drag: none;

  @media (max-width: 768px) {
    height: 200px;
  }

  @media (max-width: 480px) {
    height: 160px;
  }
`;

export const NavButton = styled("button")<{
  theme: Theme;
  $position: "left" | "right";
}>`
  position: absolute;
  top: 50%;
  ${(p) => p.$position}: 8px;
  transform: translateY(-50%);
  z-index: 2;
  background: ${(p) => withOpacity(p.theme.colors.background, 0.7)};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.full};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
  transition: all ${(p) => p.theme.transitions.fast};
  padding: 0;

  &:hover {
    background: ${(p) => withOpacity(p.theme.colors.primary, 0.15)};
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
    pointer-events: none;
  }
`;

export const DotsContainer = styled("div")`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 0 4px;
`;

export const Dot = styled("button")<{ theme: Theme; $active: boolean }>`
  width: ${(p) => (p.$active ? "20px" : "6px")};
  height: 6px;
  border-radius: ${(p) => p.theme.radii.full};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  background: ${(p) =>
    p.$active ? p.theme.colors.primary : withOpacity(p.theme.colors.muted, 0.4)};

  &:hover {
    background: ${(p) =>
      p.$active ? p.theme.colors.primary : withOpacity(p.theme.colors.muted, 0.7)};
  }
`;
