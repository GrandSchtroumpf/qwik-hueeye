import { component$, useTask$, Slot, useSignal, $, useComputed$, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import type { QwikMouseEvent , Signal, QRL } from "@builder.io/qwik";
import type { DialogAttributes } from "../types";
import { clsq } from "../utils";
import styles from './dialog.scss?inline';

interface ModalProps extends Omit<DialogAttributes, 'open'> {
  type?: 'bottom-sheet' | 'modal' | 'sidenav';
  open: Signal<boolean>;
  onOpen$?: QRL<() => void>;
  onClose$?: QRL<() => void>;
}

export const Modal = component$((props: ModalProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLDialogElement>();
  const closing = useSignal(false);
  const opened = props.open;
  const type = props.type ?? 'modal';
  const propsClass = props.class;
  const { onOpen$, onClose$ }  = props;

  // prevent default closing to keep state in sync
  useVisibleTask$(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        opened.value = false;
      }
    }
    ref.value?.addEventListener("keydown", handler);
    return (() => ref.value?.removeEventListener("keydown", handler));
  });

  useTask$(({ track }) => {
    track(() => opened.value);
    if (!ref.value) return;
    if (opened.value) {
      ref.value.showModal();
      if (onOpen$) onOpen$();
    } else {
      closing.value = true;
      if (onClose$) onClose$();
      ref.value.addEventListener('animationend', () => {
        closing.value = false;
        ref.value?.close();
      }, { once: true })
    }
  })

  const classes = useComputed$(() => clsq(
    type,
    propsClass,
    closing.value ? 'closing' : '',
    opened.value ? 'opened' : 'closed',
  ));

  const onClick = $((event: QwikMouseEvent<HTMLDialogElement, MouseEvent>, element: HTMLDialogElement) => {
    if (event.target === element) opened.value = false;
  });

  return <dialog class={classes} ref={ref} onClick$={onClick}>
    <Slot />
  </dialog>
})