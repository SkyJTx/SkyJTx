import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

export const SectionWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
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

export const TextParagraph = styled("p")<{ theme: Theme }>`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

export const ContactInfoWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;
