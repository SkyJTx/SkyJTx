import { Show, onMount, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { useTheme } from "solid-styled-components";
import { Icon } from "~/components/Icon";
import * as S from "./styles";

export interface LightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen image lightbox modal. Closes on overlay click, Escape key, or X button.
 */
export function Lightbox(props: LightboxProps) {
  const theme = useTheme();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <S.Overlay theme={theme} onClick={handleOverlayClick}>
          <S.CloseButton theme={theme} onClick={() => props.onClose()}>
            <Icon name="x" size={16} />
          </S.CloseButton>
          <S.ImageContainer>
            <S.LightboxImage src={props.src} alt={props.alt} />
          </S.ImageContainer>
        </S.Overlay>
      </Portal>
    </Show>
  );
}
