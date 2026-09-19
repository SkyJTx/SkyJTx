import type { JSX } from "@solidjs/web";
import { onSettled } from "solid-js";
import { Title } from "@solidjs/meta";
import { HomePresentation } from "~/presentations/home";
import { AboutPresentation } from "~/presentations/about";
import { WorksPresentation } from "~/presentations/works";
import { ContactsPresentation } from "~/presentations/contacts";
import { useNavigation } from "~/components/NavigationBar";

/**
 * Primary portfolio view assembling presentation modules with active section scrollspy.
 */
export default function Home(): JSX.Element {
  const nav = useNavigation();

  onSettled(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && nav.activeSection() !== id) {
            nav.setActiveSection(id);
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

    return () => {
      observer.disconnect();
    };
  });

  return (
    <div class="w-full flex flex-col items-center">
      <Title>Nattakarn Khumsupha - SkyJT</Title>
      <HomePresentation />
      <AboutPresentation />
      <WorksPresentation />
      <ContactsPresentation />
    </div>
  );
}
