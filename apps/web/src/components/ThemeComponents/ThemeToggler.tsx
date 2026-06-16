import { useThemeController } from "./ThemeController";
import { Switch, Match } from "solid-js";
import { IconButton } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useComputed } from "@skyjt/signals-solid";

export function ThemeToggler() {
  const controller = useThemeController();

  const handleToggle = () => {
    try {
      controller.toggle();
    } catch (error) {
      console.error("Failed to toggle theme", error);
    }
  };

  const getTitle = useComputed(() => {
    const mode = controller.mode;
    if (mode === "light") return "Theme: Light (click to change)";
    if (mode === "dark") return "Theme: Dark (click to change)";
    return "Theme: System (click to change)";
  });

  return (
    <IconButton
      size="sm"
      onClick={handleToggle}
      title={getTitle.value}
      ariaLabel="Toggle theme mode"
    >
      <Switch>
        <Match when={controller.mode === "light"}>
          <Icon name="sun" size={18} />
        </Match>
        <Match when={controller.mode === "dark"}>
          <Icon name="moon" size={18} />
        </Match>
        <Match when={controller.mode === "system"}>
          <Icon name="monitor" size={18} />
        </Match>
      </Switch>
    </IconButton>
  );
}

