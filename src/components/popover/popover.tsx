import type { CorrectedToggleEvent, PropsOf, QRL, Signal } from "@builder.io/qwik";
import { createContextId, useContext, useContextProvider, useId } from "@builder.io/qwik";
import { component$, Slot, useSignal, $ } from "@builder.io/qwik";
import { mergeProps } from "../utils/attributes";
import { useWithId } from "../hooks/useWithId";


export interface PopoverProps extends Omit<PropsOf<'dialog'>, 'open'> {
  anchor: string;
  /** Describe a common parent in case of stacked dialogs */
  layer?: Signal<HTMLElement | undefined>;
  position?: 'inline' | 'block';
  onClose$?: QRL<() => void>
}


export const setPopoverPosition = $(async (
  e: CorrectedToggleEvent,
  el: HTMLElement
) => {
  if (e.newState !== 'open') return;
  if ("anchorName" in document.documentElement.style) return;
  // Cleanup style if screen changed size
  // TODO: move it into a Media Matcher event instead
  if (matchMedia('(max-width: 599px)').matches) return { minWidth: '' };

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
  return new Promise<Record<string, string>>((res) => {
    const positionDialog = () => {
      const popoverRect = el.getBoundingClientRect();
      const style = {
        insetInlineStart: '',
        insetInlineEnd: '',
        insetBlockStart: '',
        insetBlockEnd: '',
        minWidth: '',
      }
      const top = anchorRect.top;
      const left = anchorRect.left;
    
      if (options.position === 'inline') {
        const overflowWidth = (popoverRect.width + anchorRect.width + anchorRect.left) > window.innerWidth;
        if (overflowWidth) style.insetInlineStart = `${left - popoverRect.width}px`;
        else style.insetInlineStart = `${left + anchorRect.width}px`;
        
        const overflowHeight = (popoverRect.height + anchorRect.top) > window.innerHeight;
        if (overflowHeight) style.insetBlockEnd = `${top}px`;
        else style.insetBlockStart = `${top}px`;
      }
      if (options.position === 'block') {
        const overflowHeight = (popoverRect.height + anchorRect.height + anchorRect.top) > window.innerHeight;
        if (overflowHeight) style.insetBlockStart = `${top - popoverRect.height}px`;
        else style.insetBlockStart = `${top + anchorRect.height}px`;
        
        const overflowWidth = (popoverRect.width + anchorRect.left) > window.innerWidth;
        if (overflowWidth) style.insetInlineEnd = `${left}px`;
        else style.insetInlineStart = `${left}px`;
  
        style.minWidth = `${anchorRect.width}px`;
      }
      if (!popoverRect.height) return requestAnimationFrame(positionDialog);
      res(style);
    }
    positionDialog();
  })
});


interface PopoverRootProps {
  popoverId?: string;
  open: Signal<boolean>;
}
export const PopoverContext = createContextId<PopoverRootProps>('PopoverContext');

interface Props {
  anchorId?: string;
  popoverId?: string;
}
export const usePopoverProvider = (props: Props) => {
  const popoverId = useWithId(props.popoverId);
  const anchorId = useWithId(props.anchorId);
  const open = useSignal(false);
  const ready = useSignal(false);
  const style = useSignal<Record<string, string>>({
    '--anchor-popover': `--${anchorId}`,
  });

  const setOpen = $(async (e: CorrectedToggleEvent, el: HTMLElement) => {
    open.value = e.newState === 'open';
    const nextStyle = await setPopoverPosition(e, el);
    if (nextStyle) style.value = nextStyle;
    ready.value = true;
  });

  const ctx = {
    open,
    popover: {
      id: popoverId,
      popover: 'auto' as const,
      class: 'he-popover position-block-end',
      'data-position': 'block',
      'data-anchor': anchorId,
      'data-ready': ready.value.toString(),
      onToggle$: [setPopoverPosition, setOpen],
      style: style.value
    },
    trigger: {
      id: anchorId,
      role: 'combobox',
      popovertarget: popoverId,
      'aria-expanded': open.value,
      style: {
        'anchor-name': `--${anchorId}`,
      }
    }
  };
  useContextProvider(PopoverContext, ctx);
  return ctx;
}



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

export const Popover = component$<PropsOf<'div'>>((props) => {
  const { popoverId, open } = useContext(PopoverContext);
  const merged = mergeProps<'div'>(props, {
    id: popoverId,
    popover: "auto",
    onToggle$: $((e) => open.value = e.newState === 'open')
  });
  return (
    <div {...merged}>
      <Slot />
    </div>
  )
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
      aria-controls={popoverId}
      aria-labelledby={'label-' + id}
    >
      <Slot />
      <svg viewBox="7 10 10 5" class={open.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
        <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
      </svg>
    </button>
  )
})