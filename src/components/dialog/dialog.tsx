import { component$, useTask$, Slot, useSignal, $, useStyles$ } from "@builder.io/qwik";
import type { Signal } from "@builder.io/qwik";
import type { DialogAttributes } from "../types";
import { mergeProps } from "../utils/attributes";
import styles from './dialog.scss?inline';

interface DialogProps extends DialogAttributes {
  type?: 'bottom-sheet' | 'modal' | 'sidenav';
  'bind:open': Signal<boolean>;
}

export const Dialog = component$((props: DialogProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLDialogElement>();
  const { 'bind:open': boundOpen, type = 'modal', ...dialogProps }  = props;

  useTask$(({ track }) => {
    const opened = track(() => boundOpen.value);
    if (!ref.value) return;
    if (opened && !ref.value.open) ref.value.showModal();
    else if (!opened && ref.value.open) ref.value.close();
  })

  const onClick$ = $((event: MouseEvent, element: HTMLDialogElement) => {
    if (event.target === element) element.close();
  });

  const attr = mergeProps<'dialog'>(dialogProps, {
    ref,
    class: ['he-dialog', type],
    onClose$: $(() => boundOpen.value = false),
    onClick$: onClick$
  });

  return <dialog {...attr}>
    <Slot />
  </dialog>
})