import { JSX } from "solid-js";
import * as S from "./styles";

export interface ContentFadeInProps {
  children?: JSX.Element;
}

export function ContentFadeIn(props: ContentFadeInProps) {
  return <S.ContentBox>{props.children}</S.ContentBox>;
}
