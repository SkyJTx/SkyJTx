import { Switch, Match } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Box } from "~/components/Box";
import { useNavigationRepo } from "~/components/NavigationBar/index";
import { Theme } from "~/components/ThemeComponents/types";
import { useThemeController } from "~/components/ThemeComponents/index";
import { useWatch } from "@skyjt/signals-solid";

const ContentContainer = styled("div")`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export default function Home() {
  const repo = useNavigationRepo<string>();

  useWatch(
    () => repo.activeMenu,
    () => {
      console.log('activeMenu', repo.activeMenu);
    }
  );

  return (
    <ContentContainer>
    </ContentContainer>
  );
}
