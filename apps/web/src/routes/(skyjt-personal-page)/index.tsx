import { useNavigationRepo } from "~/components/NavigationBar/index";
import { useWatch } from "@skyjt/signals-solid";
import { HomePresentation } from "~/presentations/home";
import { AboutPresentation } from "~/presentations/about";
import { WorksPresentation } from "~/presentations/works";
import { ContactsPresentation } from "~/presentations/contacts";
import { styled } from "solid-styled-components";
import { Switch, Match } from "solid-js";

const ContentContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
      <Switch>
        <Match when={repo.activeMenu === "Home"}>
          <HomePresentation />
        </Match>
        <Match when={repo.activeMenu === "About"}>
          <AboutPresentation />
        </Match>
        <Match when={repo.activeMenu === "Works"}>
          <WorksPresentation />
        </Match>
        <Match when={repo.activeMenu === "Contacts"}>
          <ContactsPresentation />
        </Match>
      </Switch>
    </ContentContainer>
  );
}

