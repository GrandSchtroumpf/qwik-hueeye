import type { PropsOf, QRL, Signal } from "@builder.io/qwik";
import { createContextId, sync$, useContext, useContextProvider, useId, useTask$ } from "@builder.io/qwik";
import { component$, Slot, useSignal, $, useStyles$ } from "@builder.io/qwik";
import type { PopoverOption} from "./utils";
import { setMenuPosition } from "./utils";
import { mergeProps } from "../utils/attributes";
import styles from './dialog.scss?inline';


interface PopoverProps extends Omit<PropsOf<'dialog'>, 'open'> {
  origin: Signal<HTMLElement | undefined>;
  /** Describe a common parent in case of stacked dialogs */
  layer?: Signal<HTMLElement | undefined>;
  // open: Signal<boolean>;
  position: PopoverOption['position'];
  onClose$?: QRL<() => void>
}


export const Popover = component$((props: PopoverProps) => {
  useStyles$(styles);
  const {
    origin,
    layer,
    position = 'block',
    onClose$,
    ...attr
  } = props;
  const { popoverId, open } = useContext(PopoverContext);
  const ref = useSignal<HTMLDialogElement>();
  const closing = useSignal(false);

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
    track(() => open.value);
    if (open.value) {
      if (window.matchMedia("(min-width: 600px)").matches) {
        const handler = (event: Event) => {
          const target = event.target as HTMLElement;
          if (layer?.value?.contains(target)) return;
          if (ref.value?.contains(event.target as HTMLElement)) return;
          if (ref.value === target) return;
          open.value = false;
        }
        setMenuPosition(origin.value!, ref.value!, { position });
        ref.value!.show();
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
      } else {
        const handler = (event: Event) => {
          if (event.target === ref.value) open.value = false;
        }
        ref.value!.showModal();
        ref.value?.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
      }
    } else {
      close();
    }
  });

  const merged = mergeProps<'dialog'>(attr, {
    id: popoverId,
    ref,
    class: ['popover', closing.value ? 'closing' : ''],
    onKeyDown$: [
      sync$((e: KeyboardEvent) => e.key === 'Escape' && e.preventDefault()),
      $((e: KeyboardEvent) => {
        if (e.key === 'Escape') open.value = false
      }),
    ]
  });

  return <dialog {...merged} >
    <Slot />
  </dialog>
})

interface PopoverRootProps {
  popoverId?: string;
  open?: Signal<boolean>;
}
export const PopoverContext = createContextId<PopoverRootProps>('PopoverContext');
export const PopoverRoot = component$<PopoverRootProps>((props) => {
  const popoverId = useId();
  const open = useSignal(false);
  useContextProvider(PopoverContext, {
    popoverId,
    open,
    ...props
  });
  return <Slot />
})

export const PopoverTrigger = component$<PropsOf<'button'>>((props) => {
  const id = useId();
  const { popoverId, open } = useContext(PopoverContext);
  return (
    <button 
      id={id}
      {...props}
      type="button"
      role="combobox"
      aria-haspopup="listbox" 
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="none"
      aria-expanded={open.value}
      aria-controls={popoverId}
      aria-labelledby={'label-' + id}
      onClick$={() => open.value = !open.value}
    >
      <Slot />
      <svg viewBox="7 10 10 5" class={open.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
        <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
      </svg>
    </button>
  )
})