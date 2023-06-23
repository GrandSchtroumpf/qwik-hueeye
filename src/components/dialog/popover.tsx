import type { QRL, Signal } from "@builder.io/qwik";
import { useTask$, useVisibleTask$} from "@builder.io/qwik";
import { component$, Slot, useSignal, $, useComputed$, useStyles$ } from "@builder.io/qwik";
import type { DialogAttributes } from "../types";
import type { PopoverOption} from "./utils";
import { setMenuPosition } from "./utils";
import styles from './dialog.scss?inline';
import { clsq } from "../utils";


interface PopoverProps extends Omit<DialogAttributes, 'open'> {
  origin: Signal<HTMLElement | undefined>;
  /** Describe a common parent in case of stacked dialogs */
  layer?: Signal<HTMLElement | undefined>;
  open: Signal<boolean>;
  position: PopoverOption['position'];
  onOpen$?: QRL<() => void>
  onClose$?: QRL<() => void>
}


export const Popover = component$((props: PopoverProps) => {
  useStyles$(styles);
  const opened = props.open;
  const origin = props.origin;
  const layer = props.layer;
  const position = props.position ?? 'block';
  const ref = useSignal<HTMLDialogElement>();
  const closing = useSignal(false);
  const onClose$ = props.onClose$;
  const propsClass = props.class;

  const close = $(() => {
    if (!ref.value) return;
    closing.value = true;
    if (onClose$) onClose$();
    setTimeout(() => {
      closing.value = false;
      ref.value?.close();
    }, 200);
  });

  useTask$(({ track }) => {
    track(() => opened.value);
    if (opened.value) {
      if (window.matchMedia("(min-width: 600px)").matches) {
        const handler = (event: Event) => {
          const target = event.target as HTMLElement;
          if (layer?.value?.contains(target)) return;
          if (ref.value?.contains(event.target as HTMLElement)) return;
          if (ref.value === target) return;
          opened.value = false;
        }
        setMenuPosition(origin.value!, ref.value!, { position });
        ref.value!.show();
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
      } else {
        const handler = (event: Event) => {
          if (event.target === ref.value) opened.value = false;
        }
        ref.value!.showModal();
        ref.value?.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
      }
    } else {
      close();
    }
  });

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


  const classes = useComputed$(() => clsq(
    'popover',
    propsClass,
    closing.value ? 'closing' : ''
  ));

  return <dialog class={classes} ref={ref} >
    <Slot />
  </dialog>
})