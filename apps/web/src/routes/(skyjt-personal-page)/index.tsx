import { useNavigationRepo } from "~/components/NavigationBar/index";
import { HomePresentation } from "~/presentations/home";
import { AboutPresentation } from "~/presentations/about";
import { WorksPresentation } from "~/presentations/works";
import { ContactsPresentation } from "~/presentations/contacts";
import { styled } from "solid-styled-components";
import { onMount, onCleanup } from "solid-js";

const ContentContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export default function Home() {
  const repo = useNavigationRepo<string>();

  onMount(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (typeof window !== "undefined" && window.isScrollingToSection) {
        return;
      }
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            repo.activeMenu = id;
          }
        }
      }
    }, observerOptions);

    const sections = ["Home", "About", "Works", "Contacts"];
    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) {
        observer.observe(el);
      }
    }

    onCleanup(() => {
      observer.disconnect();
    });
  });

  return (
    <ContentContainer>
      <HomePresentation />
      <AboutPresentation />
      <WorksPresentation />
      <ContactsPresentation />
    </ContentContainer>
  );
}


