import { JSX } from "solid-js";
import { useTheme } from "solid-styled-components";
import * as S from "./styles";

export interface PlaceholderProps {
  title: string;
  description: string;
  children?: JSX.Element;
}

export function Placeholder(props: PlaceholderProps) {
  const theme = useTheme();

  return (
    <S.PlaceholderWrapper>
      <S.PlaceholderTitle theme={theme}>{props.title}</S.PlaceholderTitle>
      <S.PlaceholderDescription theme={theme}>
        {props.description}
      </S.PlaceholderDescription>
      {props.children}
    </S.PlaceholderWrapper>
  );
}
