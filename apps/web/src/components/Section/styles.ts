import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

export const SectionWrapper = styled("section")<{ theme: Theme; $maxWidth?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: ${(p) => p.$maxWidth || "1200px"};
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
