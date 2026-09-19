import type { RouteSectionProps } from "@solidjs/router";
import type { JSX } from "@solidjs/web";
import { Background } from "~/components/Background";
import { NavigationBar, NavigationProvider, useNavigation } from "~/components/NavigationBar";

function MainLayoutContent(props: RouteSectionProps): JSX.Element {
  const nav = useNavigation();
  const sections = ["Home", "About", "Works", "Contacts"] as const;

  return (
    <div class="min-h-screen bg-base-100 text-base-content font-sans flex flex-col relative overflow-x-hidden">
      <Background>
        <div class="w-full min-h-screen flex flex-col">
          <NavigationBar
            sections={sections}
            activeSection={nav.activeSection()}
            onSelectSection={nav.scrollToSection}
          />
          <main class="flex-1 w-full flex flex-col items-center">
            {props.children}
          </main>
        </div>
      </Background>
    </div>
  );
}

/**
 * Top-level main layout providing navigation and background across portfolio views.
 */
export default function MainLayout(props: RouteSectionProps): JSX.Element {
  return (
    <NavigationProvider>
      <MainLayoutContent {...props} />
    </NavigationProvider>
  );
}
