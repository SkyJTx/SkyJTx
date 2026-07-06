import { JSX, Show } from "solid-js";
import { useTheme } from "solid-styled-components";
import { Box } from "~/components/Box";
import * as S from "./styles";

export interface CardProps {
  media?: JSX.Element;
  title?: string;
  description?: string;
  actions?: JSX.Element;
  children?: JSX.Element;
}

export function Card(props: CardProps) {
  const theme = useTheme();

  return (
    <Box padding="1rem" style={{ height: "100%" }}>
      <S.CardContainer>
        <Show when={props.media}>
          <S.MediaSection>{props.media}</S.MediaSection>
        </Show>

        <S.ContentSection>
          <Show when={props.title}>
            <S.CardTitle theme={theme}>{props.title}</S.CardTitle>
          </Show>
          <Show when={props.description}>
            <S.CardDescription theme={theme}>
              {props.description}
            </S.CardDescription>
          </Show>
          
          {props.children}

          <Show when={props.actions}>
            <S.ActionsRow>{props.actions}</S.ActionsRow>
          </Show>
        </S.ContentSection>
      </S.CardContainer>
    </Box>
  );
}
