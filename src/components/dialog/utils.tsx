import { $ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";

export interface DialogState {
  ref: Signal<HTMLDialogElement | undefined>;
  opened: boolean;
  closing: boolean;
}
export const closeDialog = $((state: DialogState) => {
  state.closing = true;
  setTimeout(() => {
    state.closing = false;
    state.opened = false;
    state.ref.value?.close();
  }, 200);
})
