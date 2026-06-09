import { JSX, Show, children } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Box } from "~/components/Box";
import { Theme } from "~/components/ThemeComponents/types";

interface NavigationBarProps {
  menu: JSX.Element;
  action?: JSX.Element;
}

const NavInner = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
`;

const NavLeft = styled("div")`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Divider = styled("div")<{ theme: Theme }>`
  width: 1px;
  height: 24px;
  background-color: ${(props) => props.theme.colors.border};
  margin: 0 1rem;
`;

const NavRight = styled("div")`
  display: flex;
  align-items: center;
`;

export function NavigationBar(props: NavigationBarProps) {
  const theme = useTheme() as Theme;
  const resolvedAction = children(() => props.action);

  return (
    <Box
      style={{
        padding: "0.4rem 1rem",
        position: "relative",
        overflow: "visible",
        margin: "0 auto",
      }}
      fitContent={true}
    >
      <NavInner>
        <NavLeft>
          {props.menu}
        </NavLeft>
        <Show when={resolvedAction()}>
          <Divider theme={theme} />
          <NavRight>
            {resolvedAction()}
          </NavRight>
        </Show>
      </NavInner>
    </Box>
  );
}
