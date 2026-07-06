import { children, JSX, Show } from "solid-js";
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
  const media = children(() => props.media);
  const actions = children(() => props.actions);

  return (
    <Box padding="1rem" style={{ height: "100%" }}>
      <S.CardContainer>
        <Show when={media()}>
          <S.MediaSection>{media()}</S.MediaSection>
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

          <Show when={actions()}>
            <S.ActionsRow>{actions()}</S.ActionsRow>
          </Show>
        </S.ContentSection>
      </S.CardContainer>
    </Box>
  );
}
