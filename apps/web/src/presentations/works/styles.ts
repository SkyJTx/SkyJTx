import { styled } from "solid-styled-components";
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

export const SegmentRow = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
`;

export const ContentArea = styled("div")`
  width: 100%;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
