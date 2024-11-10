import { $, component$, createContextId, PropsOf, Slot, useContext, useContextProvider, useId, useSignal, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../utils/attributes";
import styles from './tooltip.scss?inline';

type PositionAreaInline = 'left' | 'center' | 'right' | 'span-left' | 'span-right' | 'x-start' | 'x-end' | 'span-x-start' | 'span-x-end' | 'x-self-start' | 'x-self-end' | 'span-x-self-start' | 'span-x-self-end' | 'span-all';
type PositionAreaBlock = 'top' | 'center' | 'bottom' | 'span-top' | 'span-bottom' | 'y-start' | 'y-end' | 'span-y-start' | 'span-y-end' | 'y-self-start' | 'y-self-end' | 'span-y-self-start' | 'span-y-self-end' | 'span-all';

interface TooltipCtx {
  id: string;
  area: PositionAreaInline | PositionAreaBlock | `${PositionAreaInline} ${PositionAreaBlock}`;
  actions: ('hover' | 'click' | 'focus')[];
  timeout: number;
}

const TooltipContext = createContextId<TooltipCtx>('TooltipContext');

export const Root = component$<Partial<TooltipCtx>>((props) => {
  useStyles$(styles);
  const id = useId();
  useContextProvider(TooltipContext, {
    id,
    area: 'top',
    actions: ['hover', 'click', 'focus'],
    timeout: 500,
    ...props
  });
  useContext(TooltipContext);
  return <Slot /> 
});

export const Trigger = component$<PropsOf<'button'>>((props) => {
  const ctx = useContext(TooltipContext);
  const lock = useSignal(false);

  const click = {
    onClick$: $(() => lock.value = true),
    onBlur$: $(() => lock.value = false),
  }
  
  const hover = {
    onMouseEnter$: $(() => {
      const panel = document.getElementById(ctx.id);
      setTimeout(() => panel?.showPopover(), ctx.timeout);
    }),
    onMouseLeave$: $(() => {
      const panel = document.getElementById(ctx.id);
      if (!lock.value) panel?.hidePopover();
    }),
  };
  const focus = {
    onFocus$: $(() => {
      const panel = document.getElementById(ctx.id);
      setTimeout(() => panel?.showPopover(), ctx.timeout);
    }),
    onBlur$: $(() => {
      const panel = document.getElementById(ctx.id);
      panel?.hidePopover();
    }),
  }

  const clickAttr = ctx.actions.includes('click') ? click : {};
  const hoverAttr = ctx.actions.includes('hover') ? hover : {};
  const focusAttr = ctx.actions.includes('focus') ? focus : {};

  const attr = mergeProps<'button'>(props, clickAttr, hoverAttr, focusAttr, {
    class: 'he-tooltip-trigger',
    popovertarget: ctx.id,
    style: {
      ['--anchor-id']: `--${ctx.id}`
    },
    'aria-describedby': ctx.id,
  })
  return <button {...attr}>
    <Slot />
  </button>
});

export const Panel = component$<PropsOf<'div'>>((props) => {
  const ctx = useContext(TooltipContext);
  const attr = mergeProps<'div'>(props, {
    id: ctx.id,
    class: ['he-tooltip-panel he-popover'],
    style: {
      ['--anchor-id']: `--${ctx.id}`,
      ['position-area' as any]: ctx.area,
    },
    popover: ctx.actions.includes('click') ? 'auto' : 'manual',
  });
  return <div {...attr}>
    <Slot />
  </div>
})