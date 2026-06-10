import { createContext, useContext, JSX } from "solid-js";
import { Signal } from "@skyjt/signals-solid";
import { NavigationRepository } from "./Repository";

const NavigationContext = createContext<NavigationRepository<any>>();

export function NavigationProvider<T>(props: {
  initialMenu?: T;
  activeMenu?: Signal<T>;
  children: JSX.Element;
}) {
  const repo = new NavigationRepository<T>(
    props.activeMenu ? props.activeMenu.peek() : props.initialMenu!,
    props.activeMenu
  );

  return (
    <NavigationContext.Provider value={repo}>
      {props.children}
    </NavigationContext.Provider>
  );
}

export function useNavigationRepo<T>(): NavigationRepository<T> {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationRepo must be used within a NavigationProvider");
  }
  return context as NavigationRepository<T>;
}
