import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

export const SectionWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
  min-height: auto;
  padding: 6rem 2rem;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 4rem 1rem;
  }
`;

export const ContentBox = styled("div")`
  width: 100%;
  margin-top: 2rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const AboutGrid = styled("div")`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: 1.2fr 1fr;
  }
`;

export const BioParagraph = styled("p")<{ theme: Theme }>`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 1rem;
  font-family: ${(p) => p.theme.typography.fontFamily};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionSubTitle = styled("h3")<{ theme: Theme }>`
  font-size: 1.2rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.primary};
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const Timeline = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
`;

export const TimelineItem = styled("div")<{ theme: Theme }>`
  position: relative;
  padding-left: 1.5rem;
  border-left: 2px solid ${(p) => p.theme.colors.border};

  &::before {
    content: "";
    position: absolute;
    left: -6px;
    top: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.primary};
    border: 2px solid ${(p) => p.theme.colors.background};
    box-shadow: 0 0 8px ${(p) => p.theme.colors.primary};
  }
`;

export const TimelineDate = styled("span")<{ theme: Theme }>`
  font-size: 0.75rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  color: ${(p) => p.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TimelineTitle = styled("h4")<{ theme: Theme }>`
  font-size: 1rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0.25rem 0 0.125rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const TimelineSub = styled("div")<{ theme: Theme }>`
  font-size: 0.85rem;
  color: ${(p) => p.theme.colors.muted};
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const TimelineGpax = styled("span")<{ theme: Theme }>`
  font-size: 0.85rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.success};
  margin-left: 0.5rem;
`;

export const SkillGroup = styled("div")`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SkillGroupTitle = styled("h4")<{ theme: Theme }>`
  font-size: 0.85rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.muted};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const TagContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Tag = styled("span")<{ theme: Theme }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border: 1px solid ${(p) => p.theme.colors.border};
  font-family: ${(p) => p.theme.typography.fontFamily};
  transition: all ${(p) => p.theme.transitions.fast};

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.primary};
  }
`;
