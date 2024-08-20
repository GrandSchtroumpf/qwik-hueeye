import type { CorrectedToggleEvent, JSXChildren, PropsOf, QRL, Signal } from "@builder.io/qwik";
import { createContextId, useContext, useContextProvider } from "@builder.io/qwik";
import { component$, Slot, useSignal, $ } from "@builder.io/qwik";
import { mergeProps } from "../utils/attributes";
import { useWithId } from "../hooks/useWithId";
import { findNode } from "../utils/jsx";


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

export interface ContextProps {
  anchorId: string;
  popoverId: string;
  open: Signal<boolean>;
}
export const Context = createContextId<ContextProps>('PopoverContext');

interface Props {
  anchorId?: string;
  popoverId?: string;
}
export const usePopoverProvider = (props: Props) => {
  const popoverId = useWithId(props.popoverId);
  const anchorId = useWithId(props.anchorId);
  const open = useSignal(false);
  const anchored = useSignal(false);
  const style = useSignal<Record<string, string>>({
    '--anchor-popover': `--${anchorId}`,
  });

  const setOpen = $(async (e: CorrectedToggleEvent, el: HTMLElement) => {
    open.value = e.newState === 'open';
    const nextStyle = await setPopoverPosition(e, el);
    if (nextStyle) style.value = nextStyle;
    anchored.value = true;
  });

  useContextProvider(Context, { popoverId, anchorId, open });

  return {
    open,
    popover: {
      id: popoverId,
      popover: 'auto' as const,
      class: 'he-popover',
      'data-position': 'block',
      'data-anchor': anchorId,
      'data-anchored': anchored.value.toString(),
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
}


export type RootProps = Partial<ContextProps>;
export const RootImpl = component$<RootProps>((props) => {
  const popoverId = useWithId(props.popoverId);
  const anchorId = useWithId(props.anchorId);
  const baseOpen = useSignal(false);
  const open = props.open ?? baseOpen;
  useContextProvider(Context, { anchorId, popoverId, open });
  return <Slot />
})

export const Panel = component$<PropsOf<'div'>>((props) => {
  const { popoverId, anchorId, open } = useContext(Context);
  const anchored = useSignal(false);
  const style = useSignal<Record<string, string>>({
    '--anchor-popover': `--${anchorId}`,
  });

  const setOpen = $(async (e: CorrectedToggleEvent, el: HTMLElement) => {
    open.value = e.newState === 'open';
    const nextStyle = await setPopoverPosition(e, el);
    if (nextStyle) style.value = nextStyle;
    anchored.value = true;
  });

  const merged = mergeProps<'div'>({
    id: popoverId,
    class: 'he-popover',
    popover: props.popover ?? 'auto',
    onToggle$: [setOpen],
    style: style.value,
    ['data-anchor' as any]: anchorId,
    ['data-position' as any]: 'block',
    ['data-anchored' as any]: anchored.value.toString(),
  }, props);

  return (
    <div {...merged}>
      <Slot />
    </div>
  )
})

export const Trigger = component$<PropsOf<'button'>>((props) => {
  const { popoverId, anchorId, open } = useContext(Context);
  const attributes = mergeProps<'button'>(props, {
    id: anchorId,
    type: 'button',
    role: 'combobox',
    style: {
      ['anchor-name' as any]: `--${anchorId}`,
    }
  });
  return (
    <button 
      {...attributes}
      aria-disabled="false"
      aria-invalid="false"
      aria-autocomplete="none"
      aria-expanded={open.value}
      aria-controls={popoverId}
      aria-labelledby={'label-' + anchorId}
    >
      <Slot />
      <svg viewBox="7 10 10 5" class={open.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
        <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
      </svg>
    </button>
  )
})


export const Root = (props: RootProps & { children: JSXChildren }) => {
  const { children, ...baseRootProps } = props;
  const anchorId = props.anchorId ?? findNode(children, Trigger)?.props.id;
  const popoverId = props.popoverId ?? findNode(children, Panel)?.props.id;
  const rootProps = { ...baseRootProps, anchorId, popoverId };
  return <RootImpl {...rootProps}>{children}</RootImpl>;
}
