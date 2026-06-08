import { JSX } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Box } from "~/components/Box";
import { Theme } from "~/theme/types";

interface NavigationBarProps {
  menu: JSX.Element;
  action?: JSX.Element;
}

const NavInner = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  margin: 0 ${(props) => props.theme.spacing.lg};
`;

const NavRight = styled("div")`
  display: flex;
  align-items: center;
`;

export function NavigationBar(props: NavigationBarProps) {
  const theme = useTheme() as Theme;

  return (
    <Box style={{ padding: "0.5rem 1.5rem" }}>
      <NavInner>
        <NavLeft>
          {props.menu}
        </NavLeft>
        {props.action && (
          <>
            <Divider theme={theme} />
            <NavRight>
              {props.action}
            </NavRight>
          </>
        )}
      </NavInner>
    </Box>
  );
}
