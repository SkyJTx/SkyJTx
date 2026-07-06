import { styled } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

export const ScrollIndicatorWrapper = styled("div")<{ theme: Theme }>`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: ${(p) => p.theme.colors.muted};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  animation: bounce 2s infinite;
  transition: color ${(p) => p.theme.transitions.fast};
  z-index: 10;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }

  @media (max-height: 680px) {
    bottom: 1rem;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-6px);
    }
    60% {
      transform: translateX(-50%) translateY(-3px);
    }
  }
`;
