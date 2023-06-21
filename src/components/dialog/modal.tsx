import { useContext, component$, createContextId, Slot, useStore, useSignal, $, useComputed$, useContextProvider, useStyles$ } from "@builder.io/qwik";
import { closeDialog } from "./utils";
import type { QwikMouseEvent } from "@builder.io/qwik";
import type { DialogState } from "./utils";
import styles from './dialog.scss?inline';

const DialogContext = createContextId<DialogState>('DialogContext');

// TODO: create an onCloseQRL method

export const useModal = () => {
  const state = useStore<DialogState>({
    ref: useSignal<HTMLDialogElement>(),
    opened: false,
    closing: false,
  });

  useContextProvider(DialogContext, state);
  
  return {
    state,
    open: $(() => {
      const dialog = state.ref.value;
      if (!dialog) throw new Error('Cannot find dialog in the template ?');
      state.opened = true;
      dialog.showModal();
    }),
    close: $(() => closeDialog(state)),
  }
}

interface ModalProps {
  type?: 'bottom-sheet' | 'modal' | 'sidenav';
}

export const Modal = component$((props: ModalProps) => {
  useStyles$(styles);
  const state = useContext(DialogContext);
  const classes = useComputed$(() => [
    props.type ?? 'modal',
    state.closing ? 'closing' : ''
  ].join(' '));
  const onClick = $((event: QwikMouseEvent<HTMLDialogElement, MouseEvent>, element: HTMLDialogElement) => {
    if (event.target === element) closeDialog(state);
  })
  return <dialog class={classes} ref={state.ref} onClick$={onClick}>
    <Slot />
  </dialog>
})