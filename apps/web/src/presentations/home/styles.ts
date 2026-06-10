import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { withOpacity } from "~/components/ThemeComponents";

export const HomeWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

export const HeroSection = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  min-height: 450px;
  padding: 4rem 2rem 5rem 2rem;
  box-sizing: border-box;
  position: relative;
  text-align: center;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (max-height: 680px) {
    padding: 3rem 1rem 4rem 1rem;
  }

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

export const HeroContent = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 1.5rem;
  box-sizing: border-box;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 3rem;
  }
`;

export const HeroLeft = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1.2;
  width: 100%;

  @media (min-width: 768px) {
    align-items: flex-start;
    text-align: left;
  }
`;

export const HeroRight = styled("div")<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0.8;
  width: 100%;
`;

export const SocialLinksWrapper = styled("div")<{ theme: Theme }>`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;

  @media (min-width: 768px) {
    justify-content: flex-start;
    margin-top: 0.75rem;
  }
`;

export const LogoWrapper = styled("div")<{ theme: Theme }>`
  filter: drop-shadow(0 8px 24px rgba(56, 189, 248, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Greeting = styled("span")<{ theme: Theme }>`
  font-size: 0.875rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
`;

export const Description = styled("p")<{ theme: Theme }>`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.muted};
  max-width: 500px;
  margin-top: 0;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-family: ${(p) => p.theme.typography.fontFamily};

  @media (min-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 2.5rem;
  }
`;

export const ButtonGroup = styled("div")<{ theme: Theme }>`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    justify-content: flex-start;
    margin-bottom: 1.75rem;
  }
`;

export const ScrollIndicator = styled("div")<{ theme: Theme }>`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  animation: bounce 2s infinite;
  transition: color ${(p) => p.theme.transitions.fast};
  z-index: 10;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }

  @media (max-height: 680px) {
    bottom: 1rem;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-6px);
    }
    60% {
      transform: translateX(-50%) translateY(-3px);
    }
  }
`;

export const FocusSection = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 1200px;
  padding: 6rem 2rem 8rem 2rem;
  box-sizing: border-box;
`;

export const SectionTitle = styled("h2")<{ theme: Theme }>`
  font-size: 1.75rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2.5rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
  text-align: center;
  letter-spacing: -0.02em;
`;

export const FocusGrid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

export const CardContent = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  height: 100%;
`;

export const CardIconWrapper = styled("div")<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => withOpacity(p.theme.colors.primary, 0.08)};
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 1.25rem;
`;

export const CardTitle = styled("h3")<{ theme: Theme }>`
  font-size: 1.25rem;
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 0.5rem 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const CardDescription = styled("p")<{ theme: Theme }>`
  font-size: 0.95rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;
