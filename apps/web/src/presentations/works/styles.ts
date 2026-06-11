import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents/index";

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

export const ProjectGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 3rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CardLayout = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const ProjectInfo = styled("div")`
  display: flex;
  flex-direction: column;
`;

export const ProjectTitle = styled("h3")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize["2xl"]};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 0.5rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const ProjectDescription = styled("p")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize.base};
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const TagList = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const TechTag = styled("span")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  padding: 0.2rem 0.6rem;
  border-radius: ${(p) => p.theme.radii.full};
  background: ${(p) => withOpacity(p.theme.colors.primary, 0.08)};
  color: ${(p) => p.theme.colors.primary};
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const WorksBoxContainer = styled("div")`
  width: 100%;
  margin-top: ${(p) => p.theme.spacing["2xl"]};
`;

export const PlaceholderWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

export const PlaceholderTitle = styled("div")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize["2xl"]};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

export const PlaceholderDescription = styled("p")<{ theme: Theme }>`
  margin: 0;
  color: ${(p) => p.theme.colors.muted};
  font-size: ${(p) => p.theme.typography.fontSize.base};
  max-width: 400px;
  line-height: ${(p) => p.theme.typography.lineHeight.relaxed};
  font-family: ${(p) => p.theme.typography.fontFamily};
`;
