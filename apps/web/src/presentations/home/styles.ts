import { styled } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Theme } from "~/components/ThemeComponents/types";

export const HomeWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-height: 700px) {
    justify-content: flex-start;
  }
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  gap: 1.5rem;
  box-sizing: border-box;
`;

export const HeroLeft = styled("div")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

export const Title = styled(BrandTitle)`
  font-size: clamp(1.75rem, 4.5vw, 2.8rem);
  line-height: 1.15;
`;

export const Subtitle = styled(BrandSubtitle)<{ theme: Theme }>`
  margin-bottom: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.sm};
  font-size: clamp(0.85rem, 2vw, 1.05rem);
  max-width: 100%;
`;

export const SocialLinksWrapper = styled("div")<{ theme: Theme }>`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
`;

export const Description = styled("p")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize.base};
  color: ${(p) => p.theme.colors.muted};
  max-width: 500px;
  margin-top: 0;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-family: ${(p) => p.theme.typography.fontFamily};

  @media (min-width: 768px) {
    font-size: ${(p) => p.theme.typography.fontSize.lg};
    margin-bottom: 2.5rem;
  }
`;

