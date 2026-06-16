import { styled } from "solid-styled-components";
import { Box } from "~/components/Box";
import { BrandTitle } from "~/components/Brand";
import { Theme } from "~/components/ThemeComponents/types";

export const SectionWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  padding: 6rem 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }

  @media (max-height: 700px) {
    justify-content: flex-start;
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

export const AboutBox = styled(Box)`
  max-width: 900px;
  margin: 0 auto;

  && {
    padding: 3.5rem 4rem;

    @media (max-width: 768px) {
      padding: 2.5rem;
    }

    @media (max-width: 480px) {
      padding: 1.75rem 1.25rem;
    }
  }
`;

export const AboutTitle = styled(BrandTitle)<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize["2xl"]};
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

export const BioParagraph = styled("p")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize.base};
  line-height: 1.6;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
  text-align: left;
`;

export const Divider = styled("hr")<{ theme: Theme }>`
  width: 100%;
  border: 0;
  height: 1px;
  background: ${(p) => p.theme.colors.border};
  margin: 1.5rem 0;
  opacity: 0.7;
`;

export const AboutContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4.5rem;
  }
`;

export const AvatarWrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
`;

export const CircleAvatar = styled("div")<{ theme: Theme }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.surface};
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }

  &:hover {
    transform: scale(1.05);
    border-color: ${(p) => p.theme.colors.secondary};
    box-shadow: 0 0 20px ${(p) => p.theme.colors.primary}44;
  }
`;

export const AvatarImage = styled("img")`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TextContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
`;

export const InfoGrid = styled("div")`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InfoItem = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  color: ${(p) => p.theme.colors.text};

  svg {
    color: ${(p) => p.theme.colors.primary};
    flex-shrink: 0;
  }

  @media (max-width: 360px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;
  }
`;

export const InfoLabel = styled("span")<{ theme: Theme }>`
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.primary};
  min-width: 75px;
  flex-shrink: 0;
`;

export const InfoValue = styled("span")<{ theme: Theme }>`
  color: inherit;
  word-break: break-all;

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${(p) => p.theme.transitions.fast};
    word-break: break-all;

    &:hover {
      color: ${(p) => p.theme.colors.primary};
    }
  }
`;

export const ButtonContainer = styled("div")`
  margin-top: 1.75rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ResumeButton = styled("a")<{ theme: Theme }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${(p) => p.theme.typography.fontFamily};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  padding: 0.6rem 1.25rem;
  border-radius: ${(p) => p.theme.radii.md};
  cursor: pointer;
  transition: all ${(p) => p.theme.transitions.fast};
  user-select: none;
  text-decoration: none;
  outline: none;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary} 0%,
    ${(p) => p.theme.colors.secondary} 100%
  );
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-1px);
  }
`;
