import { component$, useTask$, Slot, useSignal, $, useStyles$, createContextId, useContextProvider, useContext } from "@builder.io/qwik";
import type { PropsOf, QRL, Signal } from "@builder.io/qwik";
import type { DialogAttributes } from "../types";
import { mergeProps } from "../utils/attributes";
import styles from './dialog.scss?inline';

interface DialogProps extends DialogAttributes {
  type?: 'bottom-sheet' | 'modal' | 'sidenav';
  'bind:open': Signal<boolean>;
}

function useSwipeDown<E extends HTMLElement = HTMLElement>(cb: QRL<(el: E) => any>) {
  const y = useSignal(0);
  const onTouchStart$ = $((e: TouchEvent) => {
    y.value = e.touches.item(0)!.clientY;
  });
  const onTouchMove$ = $((e: TouchEvent, el: E) => {
    const deltaY = Math.max(e.touches.item(0)!.clientY - y.value, 0);
    el.style.transform = `translateY(${deltaY}px)`;
  });
  const onTouchEnd$ = $((e: TouchEvent, el: E) => {
    const deltaY = Math.max(e.changedTouches.item(0)!.clientY - y.value, 0);
    if (deltaY > 20) cb(el);
    el.style.transform = '';
  });
  return {
    onTouchStart$,
    onTouchMove$,
    onTouchEnd$,
  }
}
function useSwipeLeft<E extends HTMLElement = HTMLElement>(cb: QRL<(el: E) => any>) {
  const x = useSignal(0);

  const onTouchStart$ = $((e: TouchEvent) => {
    x.value = e.touches.item(0)!.clientX;
  });
  const onTouchMove$ = $((e: TouchEvent, el: E) => {
    const deltaX = Math.min(e.touches.item(0)!.clientX - x.value, 0);
    el.style.transform = `translateX(${deltaX}px)`;
  });
  const onTouchEnd$ = $((e: TouchEvent, el: E) => {
    const deltaX = Math.min(e.changedTouches.item(0)!.clientX - x.value, 0);
    if (deltaX < -20) cb(el);
    el.style.transform = '';
  });
  return {
    onTouchStart$,
    onTouchMove$,
    onTouchEnd$,
  }
}


const DialogContext = createContextId<{ open: Signal<boolean>}>('DialogContext');

export const Dialog = component$((props: DialogProps) => {
  useStyles$(styles);
  const ref = useSignal<HTMLDialogElement>();
  const { 'bind:open': boundOpen, type = 'modal', ...dialogProps }  = props;
  useContextProvider(DialogContext, { open: boundOpen });

  useTask$(({ track }) => {
    const opened = track(() => boundOpen.value);
    if (!ref.value) return;
    if (opened && !ref.value.open) ref.value.showModal();
    else if (!opened && ref.value.open) ref.value.close();
  })

  const swipeDown = useSwipeDown(
    $((el: HTMLDialogElement) => el.close())
  );
  const swipeLeft = useSwipeLeft(
    $((el: HTMLDialogElement) => el.close())
  );

  const swipe = (() => {
    if (type === 'bottom-sheet') return swipeDown; 
    if (type === 'sidenav') return swipeLeft;
    return {}; 
  }) 

  const onClick$ = $((event: MouseEvent, element: HTMLDialogElement) => {
    if (event.target === element) element.close();
  }); 

  const attr = mergeProps<'dialog'>(dialogProps, {
    ref,
    class: ['he-dialog', type],
    onClose$: $(() => boundOpen.value = false),
    onClick$: onClick$,
    ...swipe()
  });

  return <dialog {...attr}>
    <Slot />
  </dialog>
})

export const CloseDialog = component$<PropsOf<'button'>>((props) => {
  const { open } = useContext(DialogContext);
  const attr = mergeProps<'button'>(props, {
    onClick$: $(() => open.value = false),
  })
  return <button {...attr}>
    <Slot />
  </button>
})