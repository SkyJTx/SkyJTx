import { JSX } from "solid-js";
import { useTheme } from "solid-styled-components";
import * as S from "./styles";

export interface SectionProps {
  children?: JSX.Element;
  maxWidth?: string;
}

export function Section(props: SectionProps) {
  const theme = useTheme();

  return (
    <S.SectionWrapper theme={theme} $maxWidth={props.maxWidth}>
      {props.children}
    </S.SectionWrapper>
  );
}
