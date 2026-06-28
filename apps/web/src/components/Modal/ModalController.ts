import { useSignal } from "@skyjt/signals-solid";

/**
 * Controller class to manage the open and close states of a Modal component.
 */
export class ModalController {
  private isOpenSignal = useSignal(false);

  /**
   * Returns whether the modal is currently open.
   */
  public get isOpen(): boolean {
    return this.isOpenSignal.value;
  }

  /**
   * Sets the modal open state.
   */
  public set isOpen(value: boolean) {
    this.isOpenSignal.value = value;
  }

  /**
   * Opens the modal.
   */
  public open() {
    this.isOpenSignal.value = true;
  }

  /**
   * Closes the modal.
   */
  public close() {
    this.isOpenSignal.value = false;
  }
}
