import type { JSX } from "@solidjs/web";
import { Title } from "@solidjs/meta";
import { HomePresentation } from "~/presentations/home";
import { AboutPresentation } from "~/presentations/about";
import { WorksPresentation } from "~/presentations/works";
import { ContactsPresentation } from "~/presentations/contacts";
import { useNavigation, useScrollspy } from "~/components/NavigationBar";

/**
 * Primary portfolio view assembling presentation modules with active section scrollspy.
 */
export default function Home(): JSX.Element {
  const nav = useNavigation();
  const sections = ["Home", "About", "Works", "Contacts"] as const;

  useScrollspy({
    sections,
    nav,
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
