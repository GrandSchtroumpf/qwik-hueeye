import type { CorrectedToggleEvent, PropsOf, QRL, Signal } from "@builder.io/qwik";
import { createContextId, useContext, useContextProvider, useId } from "@builder.io/qwik";
import { component$, Slot, useSignal, $ } from "@builder.io/qwik";


export interface PopoverProps extends Omit<PropsOf<'dialog'>, 'open'> {
  anchor: string;
  /** Describe a common parent in case of stacked dialogs */
  layer?: Signal<HTMLElement | undefined>;
  position?: 'inline' | 'block';
  onClose$?: QRL<() => void>
}


export const setPopoverPosition = $((e: CorrectedToggleEvent, el: HTMLElement) => {
  if (e.newState !== 'open') return;
  // Cleanup style if screen changed size
  // TODO: move it into a Media Matcher event instead
  if (matchMedia('(max-width: 599px)').matches) {
    el.style.removeProperty('inset-block-start');
    el.style.removeProperty('inset-inline-start');
    el.style.removeProperty('min-width');
    return;
  }
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
    const popoverRect = el.getBoundingClientRect();
    el.style.removeProperty('inset-inline-start');
    el.style.removeProperty('inset-inline-end');
    el.style.removeProperty('inset-block-start');
    el.style.removeProperty('inset-block-end');
    const top = anchorRect.top;
    const left = anchorRect.left;
  
    if (options.position === 'inline') {
      const overflowWidth = (popoverRect.width + anchorRect.width + anchorRect.left) > window.innerWidth;
      if (overflowWidth) el.style.setProperty('inset-inline-start', `${left - popoverRect.width}px`);
      else el.style.setProperty('inset-inline-start', `${left + anchorRect.width}px`);
      
      const overflowHeight = (popoverRect.height + anchorRect.top) > window.innerHeight;
      if (overflowHeight) el.style.setProperty('inset-block-end', `${top}px`);
      else el.style.setProperty('inset-block-start', `${top}px`);
    }
    if (options.position === 'block') {
      const overflowHeight = (popoverRect.height + anchorRect.height + anchorRect.top) > window.innerHeight;
      if (overflowHeight) el.style.setProperty('inset-block-start', `${top - popoverRect.height}px`);
      else el.style.setProperty('inset-block-start', `${top + anchorRect.height}px`);
      
      const overflowWidth = (popoverRect.width + anchorRect.left) > window.innerWidth;
      if (overflowWidth) el.style.setProperty('inset-inline-end', `${left}px`);
      else el.style.setProperty('inset-inline-start', `${left}px`);

      el.style.setProperty('min-width', `${anchorRect.width}px`);
    }
    if (!popoverRect.height) return requestAnimationFrame(positionDialog);
  }
  positionDialog();
});

export const usePopover = (anchorId?: string) => {
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