import { Show, createEffect, onCleanup, JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { useTheme } from "solid-styled-components";
import { Icon } from "~/components/Icon";
import { ModalController } from "./ModalController";
import * as S from "./styles";

export interface ModalProps {
  controller: ModalController;
  title?: string;
  variant?: "default" | "lightbox";
  children: JSX.Element;
  onClose?: () => void;
}

/**
 * Reusable Modal component supporting default and lightbox variants.
 * Handles overlay click, ESC key press, and portals to document root.
 */
export function Modal(props: ModalProps) {
  const theme = useTheme();

  createEffect(() => {
    if (props.controller.isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.controller.close();
          props.onClose?.();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      onCleanup(() => {
        document.removeEventListener("keydown", handleKeyDown);
      });
    }
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.controller.close();
      props.onClose?.();
    }
  };

  const handleCloseClick = () => {
    props.controller.close();
    props.onClose?.();
  };

  return (
    <Show when={props.controller.isOpen}>
      <Portal>
        <S.Backdrop theme={theme} variant={props.variant} onClick={handleOverlayClick}>
          <Show when={props.variant === "lightbox"}>
            <S.LightboxCloseButton theme={theme} onClick={handleCloseClick} aria-label="Close lightbox">
              <Icon name="x" size={16} />
            </S.LightboxCloseButton>
            <S.LightboxContainer onClick={(e) => e.stopPropagation()}>
              {props.children}
            </S.LightboxContainer>
          </Show>

          <Show when={props.variant !== "lightbox"}>
            <S.ModalContainer theme={theme} onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader theme={theme}>
                <Show when={props.title}>
                  <S.ModalTitle theme={theme}>{props.title}</S.ModalTitle>
                </Show>
                <S.HeaderCloseButton theme={theme} onClick={handleCloseClick} aria-label="Close modal">
                  <Icon name="x" size={18} />
                </S.HeaderCloseButton>
              </S.ModalHeader>
              {props.children}
            </S.ModalContainer>
          </Show>
        </S.Backdrop>
      </Portal>
    </Show>
  );
}
