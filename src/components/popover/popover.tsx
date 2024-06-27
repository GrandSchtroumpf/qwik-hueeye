import type { CorrectedToggleEvent, PropsOf, QRL, Signal } from "@builder.io/qwik";
import { createContextId, useContext, useContextProvider, useId } from "@builder.io/qwik";
import { component$, Slot, useSignal, $, useStyles$ } from "@builder.io/qwik";
import styles from './popover.scss?inline';


export interface PopoverProps extends Omit<PropsOf<'dialog'>, 'open'> {
  anchor: string;
  /** Describe a common parent in case of stacked dialogs */
  layer?: Signal<HTMLElement | undefined>;
  position?: 'inline' | 'block';
  onClose$?: QRL<() => void>
}


export const setPopoverPosition = $((e: CorrectedToggleEvent, el: HTMLElement) => {
  if (e.newState !== 'open') return;
  const popoverId = el.id;
  const anchorId = el.dataset.anchor;
  const options = {
    position: el.dataset.position ?? 'block',
  };
  const anchor: HTMLElement | null = anchorId
    ? document.getElementById(anchorId)
    : document.querySelector(`[popovertarget=${popoverId}]`);
  if (!anchor) throw new Error('[HueEye Popover] Could not find anchor');
  const anchorRect = anchor.getBoundingClientRect();
  const positionDialog = () => {
    const dialogRect = el.getBoundingClientRect();
    el.style.removeProperty('inset-inline-start');
    el.style.removeProperty('inset-inline-end');
    el.style.removeProperty('inset-block-start');
    el.style.removeProperty('inset-block-end');
    const top = anchorRect.top;
    const left = anchorRect.left;
  
    if (options.position === 'inline') {
      const overflowWidth = (dialogRect.width + anchorRect.width + anchorRect.left) > window.innerWidth;
      if (overflowWidth) el.style.setProperty('inset-inline-start', `${left - dialogRect.width}px`);
      else el.style.setProperty('inset-inline-start', `${left + anchorRect.width}px`);
      
      const overflowHeight = (dialogRect.height + anchorRect.top) > window.innerHeight;
      if (overflowHeight) el.style.setProperty('inset-block-end', `${top}px`);
      else el.style.setProperty('inset-block-start', `${top}px`);
    }
    if (options.position === 'block') {
      const overflowHeight = (dialogRect.height + anchorRect.height + anchorRect.top) > window.innerHeight;
      if (overflowHeight) el.style.setProperty('inset-block-start', `${top - dialogRect.height}px`);
      else el.style.setProperty('inset-block-start', `${top + anchorRect.height}px`);
      
      const overflowWidth = (dialogRect.width + anchorRect.left) > window.innerWidth;
      if (overflowWidth) el.style.setProperty('inset-inline-end', `${left}px`);
      else el.style.setProperty('inset-inline-start', `${left}px`);

      el.style.setProperty('min-width', `${anchorRect.width}px`);
    }
    if (!dialogRect.height) return requestAnimationFrame(positionDialog);
  }
  positionDialog();
});

export const usePopover = (anchorId?: string) => {
  useStyles$(styles);
  const popoverId = useId();
  const open = useSignal(false);

  const setOpen = $((e: CorrectedToggleEvent) => {
    open.value = e.newState === 'open';
  });

  
  return {
    open,
    popover: {
      id: popoverId,
      popover: 'auto' as const,
      class: 'he-popover',
      'data-position': 'block',
      'data-anchor': anchorId,
      onToggle$: [setPopoverPosition, setOpen]
    },
    trigger: {
      role: 'combobox',
      popovertarget: popoverId,
      'aria-controls': popoverId,
      'aria-expanded': open.value,
    }
  };
}

interface PopoverRootProps {
  popoverId?: string;
  open: Signal<boolean>;
}
export const PopoverContext = createContextId<PopoverRootProps>('PopoverContext');
export const PopoverRoot = component$<Partial<PopoverRootProps>>((props) => {
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
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="none"
      aria-expanded={open.value}
      aria-controls={popoverId} // TODO: should control the listbox/menu
      aria-labelledby={'label-' + id}
    >
      <Slot />
      <svg viewBox="7 10 10 5" class={open.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
        <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
      </svg>
    </button>
  )
})