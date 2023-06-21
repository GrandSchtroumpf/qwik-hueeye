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


export interface PopoverOption {
  position: 'block' | 'inline'
}
export function setMenuPosition(origin: HTMLElement, dialog: HTMLDialogElement, options: PopoverOption) {
  const originRect = origin.getBoundingClientRect();
  const positionDialog = () => {
    const dialogRect = dialog.getBoundingClientRect();
    if (!dialogRect.height) return requestAnimationFrame(positionDialog);
    const position = origin.contains(dialog) ? 'absolute' : 'fixed';
    dialog.style.removeProperty('inset-inline-start');
    dialog.style.removeProperty('inset-inline-end');
    dialog.style.removeProperty('inset-block-start');
    dialog.style.removeProperty('inset-block-end');

    const top = position === 'absolute' ? 0 : originRect.top;
    const left = position === 'absolute' ? 0 : originRect.left;

    if (options.position === 'inline') {
      const overflowWidth = (dialogRect.width + originRect.width + originRect.left) > window.innerWidth;
      if (overflowWidth) dialog.style.setProperty('inset-inline-start', `${left - dialogRect.width}px`);
      else dialog.style.setProperty('inset-inline-start', `${left + originRect.width}px`);
      
      const overflowHeight = (dialogRect.height + originRect.top) > window.innerHeight;
      if (overflowHeight) dialog.style.setProperty('inset-block-end', `${top}px`);
      else dialog.style.setProperty('inset-block-start', `${top}px`);
    } else {
      const overflowHeight = (dialogRect.height + originRect.height + originRect.top) > window.innerHeight;
      if (overflowHeight) dialog.style.setProperty('inset-block-start', `${top - dialogRect.height}px`);
      else dialog.style.setProperty('inset-block-start', `${top + originRect.height}px`);
      
      const overflowWidth = (dialogRect.width + originRect.left) > window.innerWidth;
      if (overflowWidth) dialog.style.setProperty('inset-inline-end', `${left}px`);
      else dialog.style.setProperty('inset-inline-start', `${left}px`);
    }
    dialog.style.setProperty('position', position);
  }
  positionDialog();
}