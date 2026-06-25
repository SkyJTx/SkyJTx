import { useTheme } from "solid-styled-components";
import { useSignal, useComputed } from "@skyjt/signals-solid";
import { Icon } from "~/components/Icon";
import * as S from "./styles";

export interface PdfPreviewProps {
  url: string;
  title: string;
}

/**
 * Inline PDF preview via iframe with a fallback link if loading fails.
 */
export function PdfPreview(props: PdfPreviewProps) {
  const theme = useTheme();
  const loadFailed = useSignal(false);
  const embedUrl = useComputed(() => `${props.url}#toolbar=0&navpanes=0`);

  return (
    <S.PreviewContainer theme={theme}>
      {loadFailed.value ? (
        <S.FallbackContainer theme={theme}>
          <Icon name="file-text" size={32} />
          <S.ViewButton
            theme={theme}
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external-link" size={14} />
            View Document
          </S.ViewButton>
        </S.FallbackContainer>
      ) : (
        <S.IframeWrapper>
          <S.StyledIframe
            src={embedUrl.value}
            title={props.title}
            onError={() => {
              loadFailed.value = true;
            }}
          />
        </S.IframeWrapper>
      )}
    </S.PreviewContainer>
  );
}
