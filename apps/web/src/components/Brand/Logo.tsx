import { Accessor } from "solid-js";
import { styled } from "solid-styled-components";

interface LogoProps {
  src: Accessor<string>;
  alt?: string;
  size?: string;
}

const LogoWrapper = styled("div")<{ $size: string }>`
  width: ${(p) => p.$size};
  height: ${(p) => p.$size};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.05);
  }
`;

export function Logo(props: LogoProps) {
  const size = props.size ?? "200px";

  return (
    <LogoWrapper $size={size}>
      <img
        src={props.src()}
        alt={props.alt ?? "Logo"}
        style={{ width: "100%", height: "100%" }}
      />
    </LogoWrapper>
  );
}
