import { component$, useStyles$, $, useComputed$, PropsOf, useContext, createContextId, useContextProvider, Slot, JSXOutput } from "@builder.io/qwik";
import { WithControl, WithControlGroup, extractControls, useControlProvider, useGroupControlProvider } from "../control";
import { mergeProps } from "../../utils/attributes";
import { findNode } from "../../utils/jsx";
import style from './range.scss?inline';

type RangeType = Record<string, number>;
interface BaseProps {
  /** Default to 0 */
  min: number;
  /** Default to 100 */
  max: number;
  /** Default to 1 */
  step: number
  /** Default to false */
  vertical: boolean;
  /** Disable both thumbs */
  disabled: boolean;
}

interface Context extends BaseProps {
  startName: string | number;
  endName: string | number;
  range: RangeType;
}

const RangeContext = createContextId<Context>('RangeContext');


interface Props extends Partial<BaseProps>, PropsOf<'div'> {
  children: JSXOutput;
}
export const Range = (props: WithControlGroup<RangeType, Props>) => {
  const { children, ...attr } = props;
  const startName = findNode(children, RangeStart)?.props.name;
  const endName = findNode(children, RangeEnd)?.props.name;
  return (
    <RangeImpl {...attr} startName={startName} endName={endName}>
      {children}
    </RangeImpl>
  )
}

interface PropsImpl extends Partial<BaseProps>, PropsOf<'div'> {
  /** Default to "start" */
  startName?: string | number;
  /** Default to "end" */
  endName?: string | number;
}
export const RangeImpl = component$<WithControlGroup<RangeType, PropsImpl>>((props) => {
  useStyles$(style);

  const { attr, controls } = extractControls(props);
  const {
    min = 0,
    max = 100,
    step = 1,
    startName = 'start',
    endName = 'end',
    vertical = false,
    disabled = false,
    ...rest
  } = attr;
  const { control } = useGroupControlProvider({
    value: { [startName]: min, [endName]: max },
    ...controls
  });
  useContextProvider(RangeContext, {
    min,
    max,
    step,
    range: control,
    startName,
    endName,
    vertical,
    disabled
  });
  // TODO: remove after useContext is fixed in v2.0s
  useContext(RangeContext);

  const start = control[startName];
  const end = control[endName];

  const thumbStart = useComputed$(() => (start - min) / (max - min));
  const thumbEnd = useComputed$(() => (end - min) / (max - min));

  const start$ = $((e: TouchEvent | MouseEvent, el: HTMLElement) => {
    const clamp = (v: number) => Math.max(0, Math.min(v, 1));
    const round = (v: number) => Math.round(v / step) * step;
    const getPercent = (event: TouchEvent | MouseEvent) => {
      const { width, height, left, top } = el.getBoundingClientRect();
      if (vertical) {
        const y = 'touches' in event
          ? event.touches.item(0)!.clientY
          : event.clientY;
        return clamp(((y - top) / height));
      } else {
        const x = 'touches' in event
          ? event.touches.item(0)!.clientX
          : event.clientX;
        return clamp(((x - left) / width));
      }
    }
    const percent = getPercent(e);
    const middle = (start + end) / 200;
    
    const selected = percent < middle ? 'start' : 'end';

    const setValue = (percent: number) => {
      if (selected === 'start') {
        control[startName] = round(Math.min(min + percent * (max - min), end));
      } else {
        control[endName] = round(Math.max(min + percent * (max - min), start));
      }
    }

    const move = (event: TouchEvent | MouseEvent) => {
      const percent = getPercent(event);
      setValue(percent)
    };

    const leave = () => {
      if ('touches' in e) {
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', leave);
      } else {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', leave);
      }
    };

    setValue(percent);
    if ('touches' in e) {
      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', leave);
    } else {
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', leave);
    }
  });

  const wheel$ = $((e: WheelEvent, el: HTMLElement) => {
    const clamp = (v: number) => Math.max(0, Math.min(v, 1));
    const getPercent = (event: MouseEvent) => {
      const { width, height, left, top } = el.getBoundingClientRect();
      if (vertical) return clamp(((event.clientY - top) / height));
      else return clamp(((event.clientX - left) / width));
    }
    const percent = getPercent(e);
    const middle = (start + end) / 200;
    const selected = percent < middle ? 'start' : 'end';
    if (selected === 'start') {
      if (e.deltaY < 0) control[startName] = Math.max(start - step, min);
      else control[startName] = Math.min(start + step, end);
    } else {
      if (e.deltaY < 0) control[endName] = Math.max(end - step, start);
      else control[endName] = Math.min(end + step, max);
    }
  })

  const attributes = mergeProps<'div'>(rest, {
    role: 'group',
    class: ['he-range-container', disabled ? 'disable' : ''],
    style: {
      '--he-thumb-start': thumbStart.value,
      '--he-thumb-end': thumbEnd.value
    },
    onMouseDown$: start$,
    onTouchStart$: start$,
    onWheel$: wheel$,
    'preventdefault:wheel': true,
    'aria-orientation': vertical ? 'vertical' : 'horizontal',
  });

  return (
    <div {...attributes}>
      <div class="he-range-track"></div>
      <Slot />
    </div>
  )
});

export const RangeStart = component$<WithControl<number, PropsOf<'button'>>>((props) => {
  const { min, step, range, endName, vertical, disabled } = useContext(RangeContext);
  const { attr, controls } = extractControls(props);
  const { control, change } = useControlProvider({
    name: 'start',
    ...controls
  });

  const onKeydown$ = $((e: KeyboardEvent) => {
    const current = control.value ?? min;
    const end = range[endName];
    if (e.key === 'Home') change(min);
    if (vertical) {
      if (e.key === 'ArrowUp') change(Math.max(current - step, min));
      if (e.key === 'ArrowDown') change(Math.min(current + step, end));
    } else {
      if (e.key === 'ArrowLeft') change(Math.max(current - step, min));
      if (e.key === 'ArrowRight') change(Math.min(current + step, end));
    }
    if (e.key === 'End') change(end);
  });

  const end = range[endName];
  const merged = mergeProps<'button'>(attr, {
    type: 'button',
    disabled: disabled,
    class: 'he-range-thumb-start',
    onKeyDown$: onKeydown$,
    'aria-valuemin': min,
    'aria-valuemax': end,
    'aria-valuenow': control.value ?? min,
  });

  return (
    <button {...merged}>
      <div class="he-range-thumb-shadow"></div>
      <div class="he-range-thumb-indicator"></div>
    </button>
  )
});

export const RangeEnd = component$<WithControl<number, PropsOf<'button'>>>((props) => {
  const { max, step, range, startName, vertical, disabled } = useContext(RangeContext);
  const { attr, controls } = extractControls(props);
  const { control, change } = useControlProvider({
    name: 'end',
    ...controls
  });

  const onKeydown$ = $((e: KeyboardEvent) => {
    const current = control.value ?? max;
    if (e.key === 'Home') change(start);
    if (vertical) {
      if (e.key === 'ArrowUp') change(Math.max(current - step, start));
      if (e.key === 'ArrowDown') change(Math.min(current + step, max));
    } else {
      if (e.key === 'ArrowLeft') change(Math.max(current - step, start));
      if (e.key === 'ArrowRight') change(Math.min(current + step, max));
    }
    if (e.key === 'End') change(max);
  });

  const start = range[startName];
  const merged = mergeProps<'button'>(attr, {
    type: 'button',
    class: 'he-range-thumb-end',
    disabled: disabled,
    onKeyDown$: onKeydown$,
    'aria-valuemin': start,
    'aria-valuemax': max,
    'aria-valuenow': control.value ?? max,
  });

  return (
    <button {...merged}>
      <div class="he-range-thumb-shadow"></div>
      <div class="he-range-thumb-indicator"></div>
    </button>
  );
});


export const RangeTickList = component$(() => {
  const { min, max, step } = useContext(RangeContext);
  const ticks = [];
  for (let i = min; i <= max; i += step) ticks.push(i);

  return (
    <ul class="he-range-tick-list">
      {ticks.map(i => <li key={i} class="he-range-tick"></li>)}
    </ul>
  )
});