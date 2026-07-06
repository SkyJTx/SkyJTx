import { useTheme } from "solid-styled-components";
import { Icon } from "~/components/Icon";
import * as S from "./styles";

export interface ScrollIndicatorProps {
  onClick?: () => void;
  label?: string;
}

export function ScrollIndicator(props: ScrollIndicatorProps) {
  const theme = useTheme();

  return (
    <S.ScrollIndicatorWrapper theme={theme} onClick={props.onClick}>
      <span>{props.label || "Scroll"}</span>
      <Icon name="chevron-down" size={16} />
    </S.ScrollIndicatorWrapper>
  );
}
