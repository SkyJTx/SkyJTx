import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

export const CarouselViewport = styled("div")`
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-drag: none;
`;

export const CarouselTrack = styled("div")<{ $offset: number; $isDragging: boolean }>`
  display: flex;
  transition: ${(p) => p.$isDragging ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"};
  transform: translateX(${(p) => p.$offset}%);
  will-change: transform;
`;

export const CarouselSlide = styled("div")`
  flex: 0 0 100%;
  min-width: 0;
  padding: 0 0.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: auto;

  @media (min-width: 768px) {
    flex: 0 0 50%;
  }

  @media (min-width: 1200px) {
    flex: 0 0 50%;
  }
`;

export const NavRow = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const NavButton = styled("button")<{ theme: Theme }>`
  background: ${(p) => withOpacity(p.theme.colors.surface, 0.6)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.full};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
  transition: all ${(p) => p.theme.transitions.fast};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(p) => withOpacity(p.theme.colors.primary, 0.2)};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
    pointer-events: none;
  }
`;

export const DotsContainer = styled("div")`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const Dot = styled("button")<{ theme: Theme; $active: boolean }>`
  width: ${(p) => (p.$active ? "24px" : "8px")};
  height: 8px;
  border-radius: ${(p) => p.theme.radii.full};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  background: ${(p) =>
    p.$active ? p.theme.colors.primary : withOpacity(p.theme.colors.muted, 0.35)};

  &:hover {
    background: ${(p) =>
      p.$active ? p.theme.colors.primary : withOpacity(p.theme.colors.muted, 0.6)};
  }
`;
