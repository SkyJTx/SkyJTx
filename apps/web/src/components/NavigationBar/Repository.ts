import { useSignal, Signal } from "@skyjt/signals-solid";

export class NavigationRepository<T> {
  private _activeMenu: Signal<T>;

  constructor(initialMenu: T) {
    this._activeMenu = useSignal<T>(initialMenu);
  }

  get activeMenu(): T {
    return this._activeMenu.value;
  }

  set activeMenu(value: T) {
    this._activeMenu.value = value;
  }

  setActiveMenu(value: T): void {
    this._activeMenu.value = value;
  }
}
