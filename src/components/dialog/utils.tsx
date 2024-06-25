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
export function setPopoverPosition(anchorId: string, dialog: HTMLDialogElement, options: PopoverOption) {
  const anchor = document.getElementById(anchorId);
  if (!anchor) throw new Error(`[Popover] Could not find element with id ${anchorId}`);
  const anchorRect = anchor.getBoundingClientRect();
  const positionDialog = () => {
    const dialogRect = dialog.getBoundingClientRect();
    if (!dialogRect.height) return requestAnimationFrame(positionDialog);
    const position = anchor?.contains(dialog) ? 'absolute' : 'fixed';
    dialog.style.removeProperty('inset-inline-start');
    dialog.style.removeProperty('inset-inline-end');
    dialog.style.removeProperty('inset-block-start');
    dialog.style.removeProperty('inset-block-end');
    const top = position === 'absolute' ? 0 : anchorRect.top;
    const left = position === 'absolute' ? 0 : anchorRect.left;

    if (options.position === 'inline') {
      const overflowWidth = (dialogRect.width + anchorRect.width + anchorRect.left) > window.innerWidth;
      if (overflowWidth) dialog.style.setProperty('inset-inline-start', `${left - dialogRect.width}px`);
      else dialog.style.setProperty('inset-inline-start', `${left + anchorRect.width}px`);
      
      const overflowHeight = (dialogRect.height + anchorRect.top) > window.innerHeight;
      if (overflowHeight) dialog.style.setProperty('inset-block-end', `${top}px`);
      else dialog.style.setProperty('inset-block-start', `${top}px`);
    } else {
      const overflowHeight = (dialogRect.height + anchorRect.height + anchorRect.top) > window.innerHeight;
      if (overflowHeight) dialog.style.setProperty('inset-block-start', `${top - dialogRect.height}px`);
      else dialog.style.setProperty('inset-block-start', `${top + anchorRect.height}px`);
      
      const overflowWidth = (dialogRect.width + anchorRect.left) > window.innerWidth;
      if (overflowWidth) dialog.style.setProperty('inset-inline-end', `${left}px`);
      else dialog.style.setProperty('inset-inline-start', `${left}px`);
    }
    dialog.style.setProperty('position', position);
  }
  positionDialog();
}