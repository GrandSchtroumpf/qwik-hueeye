import { component$, useStylesScoped$, $, useComputed$, PropsOf, useContext, createContextId, useContextProvider, Slot, JSXOutput } from "@builder.io/qwik";
import { WithControl, WithControlGroup, extractControls, useControlProvider, useGroupControlProvider } from "../control";
import { mergeProps } from "../../utils/attributes";
import { findNode } from "../../utils/jsx";
import style from './new-range.scss?inline';

type RangeType = Record<string, number>;
interface BaseProps {
  min: number;
  max: number;
  step: number
}

interface Context extends BaseProps {
  startName: string | number;
  endName: string | number;
  range: RangeType;
}

const NewRangeContext = createContextId<Context>('NewRangeContext');


interface Props extends Partial<BaseProps>, PropsOf<'div'> {
  children: JSXOutput;
}
export const NewRange = (props: WithControlGroup<RangeType, Props>) => {
  const { children, ...attr } = props;
  const startName = findNode(children, NewRangeStart)?.props.name ?? 'start';
  const endName = findNode(children, NewRangeEnd)?.props.name ?? 'end';
  return (
    <NewRangeImpl {...attr} startName={startName} endName={endName}>
      {children}
    </NewRangeImpl>
  )
}

interface PropsImpl extends Partial<BaseProps>, PropsOf<'div'> {
  startName: string | number;
  endName: string | number;
}
export const NewRangeImpl = component$<WithControlGroup<RangeType, PropsImpl>>((props) => {
  useStylesScoped$(style);

  const { attr, controls } = extractControls(props);
  const { min = 0, max = 100, step = 1, startName, endName, ...rest } = attr;
  const { control } = useGroupControlProvider({
    value: { [startName]: min, [endName]: max },
    ...controls
  });
  useContextProvider(NewRangeContext, { min, max, step, range: control, startName, endName });

  const start = control[startName];
  const end = control[endName];

  const thumbStart = useComputed$(() => (start - min) / (max - min));
  const thumbEnd = useComputed$(() => (end - min) / (max - min));

  const start$ = $((e: MouseEvent, el: HTMLElement) => {
    const clamp = (v: number) => Math.max(0, Math.min(v, 1));
    const round = (v: number) => Math.round(v / step) * step;
    const { width, left } = el.getBoundingClientRect();
    const percent = clamp(((e.clientX - left) / width));
    const middle = (start + end) / 200;
    
    const selected = percent < middle ? 'start' : 'end';

    const setValue = (percent: number) => {
      if (selected === 'start') {
        control[startName] = round(Math.min(min + percent * (max - min), end));
      } else {
        control[endName] = round(Math.max(min + percent * (max - min), start));
      }
    }

    const move = (event: MouseEvent) => {
      const percent = clamp((event.clientX - left) / width);
      setValue(percent)
    };

    const leave = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', leave);
    };

    setValue(percent);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', leave);
  });

  const wheel$ = $((e: WheelEvent, el: HTMLElement) => {
    const clamp = (v: number) => Math.max(0, Math.min(v, 1));
    const { width, left } = el.getBoundingClientRect();
    const percent = clamp(((e.clientX - left) / width));
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
    class: 'he-range-container',
    style: {
      '--he-thumb-start': thumbStart.value,
      '--he-thumb-end': thumbEnd.value
    }
  });

  return (
    <div {...attributes} onMouseDown$={start$} onWheel$={wheel$} preventdefault:wheel>
      <div class="he-range-track"></div>
      <Slot />
    </div>
  )
});

export const NewRangeStart = component$<WithControl<number, PropsOf<'button'>>>((props) => {
  useStylesScoped$(style);
  const { min, step, range, endName } = useContext(NewRangeContext);
  const { attr, controls } = extractControls(props);
  const { control, onChange } = useControlProvider({
    name: 'start',
    ...controls
  });

  const onKeydown$ = $((e: KeyboardEvent) => {
    const current = control.value ?? min;
    const end = range[endName];
    if (e.key === 'Home') onChange(min);
    if (e.key === 'ArrowLeft') onChange(Math.max(current - step, min));
    if (e.key === 'ArrowRight') onChange(Math.min(current + step, end));
    if (e.key === 'End') onChange(end);
  });

  const end = range[endName];
  const merged = mergeProps<'button'>(attr, {
    type: 'button',
    class: 'he-range-thumb-start',
    onKeyDown$: onKeydown$,
    'aria-valuemin': min,
    'aria-valuemax': end,
    'aria-valuenow': control.value ?? min,
  });

  return <button {...merged}></button>
});

export const NewRangeEnd = component$<WithControl<number, PropsOf<'button'>>>((props) => {
  useStylesScoped$(style);
  const { max, step, range, startName } = useContext(NewRangeContext);
  const { attr, controls } = extractControls(props);
  const { control, onChange } = useControlProvider({
    name: 'end',
    ...controls
  });

  const onKeydown$ = $((e: KeyboardEvent) => {
    const current = control.value ?? max;
    if (e.key === 'Home') onChange(start);
    if (e.key === 'ArrowLeft') onChange(Math.max(current - step, start));
    if (e.key === 'ArrowRight') onChange(Math.min(current + step, max));
    if (e.key === 'End') onChange(max);
  });

  const start = range[startName];
  const merged = mergeProps<'button'>(attr, {
    type: 'button',
    class: 'he-range-thumb-end',
    onKeyDown$: onKeydown$,
    'aria-valuemin': start,
    'aria-valuemax': max,
    'aria-valuenow': control.value ?? max,
  });

  return <button {...merged}></button>
});