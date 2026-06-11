import { styled } from "solid-styled-components";
import { Box } from "~/components/Box";
import { BrandTitle } from "~/components/Brand";
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

export const AboutBox = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
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

export const AboutContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 2rem;
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
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.surface};
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${(p) => p.theme.colors.secondary};
    box-shadow: 0 0 16px ${(p) => p.theme.colors.primary}33;
  }
`;

export const TextContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
`;
