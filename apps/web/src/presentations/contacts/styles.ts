import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";


export const TextParagraph = styled("p")<{ theme: Theme }>`
  font-size: ${(p) => p.theme.typography.fontSize.base};
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

