import { component$, useStyles$, event$, useSignal, useVisibleTask$, Slot, PropsOf, untrack, Signal, createContextId, QRL, useContextProvider, useContext, JSXChildren } from "@builder.io/qwik";
import { cssvar } from "../../utils";
import { round } from "./utils";
import { useWithId } from "../../hooks/useWithId";
import { WithControl, WithControlGroup, extractControls, useControlProvider, useGroupControlProvider } from "../control";
import { mergeProps } from "../../utils/attributes";
import { InputAttributes } from "../types";
import { findNode } from "../../utils/jsx";
import styles from './range.scss?inline';

type RangeType = Record<string, number>;
interface BaseRangeProps extends PropsOf<'fieldset'> {
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

interface RangeCtx {
  min: number;
  max: number;
  step: number;
  startInput: Signal<HTMLInputElement | undefined>;
  endInput: Signal<HTMLInputElement | undefined>;
  resize: QRL<() => void>;
  move: QRL<(input: HTMLInputElement | undefined, mode: 'start' | 'end') => void>;
  focusLeft: QRL<(start: HTMLInputElement) => void>;
  focusRight: QRL<(start: HTMLInputElement) => void>;
}
const RangeContext = createContextId<RangeCtx>('RangeContext');

export type RangeProps = BaseRangeProps & {
  children: JSXChildren;
}
export const Range = (props: WithControlGroup<RangeType, RangeProps>) => {
  const { children, ...attr } = props;
  const startName = findNode(children, RangeStart)?.props.name ?? 'start';
  const endName = findNode(children, RangeEnd)?.props.name ?? 'end';
  return (
    <RangeImpl {...attr} startName={startName} endName={endName}>
      {children}
    </RangeImpl>
  )
}


export type RangeImplProps = BaseRangeProps & {
  startName: string | number;
  endName: string | number;
}
export const RangeImpl = component$<WithControlGroup<RangeType, RangeImplProps>>((props) => {
  useStyles$(styles);
  const id = useWithId(props.id);
  const slider = useSignal<HTMLFieldSetElement>();
  const track = useSignal<HTMLElement>();
  const startInput = useSignal<HTMLInputElement>();
  const endInput = useSignal<HTMLInputElement>();
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;
  const startName = props.startName;
  const endName = props.endName;
  
  const { attr, controls } = extractControls(props);
  const { control, name } = useGroupControlProvider({
    value: { [startName]: min, [endName]: max },
    ...controls
  });
  const initialPosition = untrack(() =>({
    start: control[startName] / (max - min),
    end: 1 - control[endName] / (max - min),
  }));
  const cssVariables = cssvar({
    initialStart: round(initialPosition.start, 0.01),
    initialEnd: round(initialPosition.end, 0.01),
    start: 0,
    end: 0
  });

  /** Set the position of the thumb & track for the input */
  const setPosition = event$((input: HTMLInputElement, mode: 'start' | 'end') => {
    const percent = input.valueAsNumber / (max - min);
    // total width - inline padding - thumb size
    const distance = track.value!.clientWidth - 20;
    const position = mode === 'start'
      ? (percent - initialPosition[mode]) * distance
      : (percent + initialPosition[mode] - 1) * distance;
    slider.value!.style.setProperty(`--${mode}`, `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${Math.floor(input.valueAsNumber)}`);
  });

  const focusLeft = event$((start: HTMLInputElement) => {
    const end = endInput.value!;
    const percent = end.valueAsNumber / (max - min) * 100;
    start.max = end.value;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
  });

  const focusRight = event$((end: HTMLInputElement) => {
    const start = startInput.value!;
    const percent = start.valueAsNumber / (max - min) * 100;
    end.min = start.value;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
  });

  const resize = event$(() => {
    const end = endInput.value!;
    const start = startInput.value!;
    const middle = start.valueAsNumber + (end.valueAsNumber - start.valueAsNumber) / 2;
    const percent = middle / (max - min) * 100;
    start.style.setProperty('width', `${percent}%`);
    end.style.setProperty('width', `${100 - percent}%`);
    end.min = start.max = middle.toString();
  });
  
  /** Resize input & set the new position */
  const move = event$((input: HTMLInputElement | undefined, mode: 'start' | 'end') => {
    if (!input) return;
    // If input have no focus yet, resize input
    if (document.activeElement !== input) {
      if (mode === 'start') focusLeft(input);
      if (mode === 'end') focusRight(input);
    }
    setPosition(input, mode);
  });


  useContextProvider(RangeContext, {
    min,
    max,
    step,
    startInput,
    endInput,
    resize,
    move,
    focusLeft,
    focusRight,
  });

  // Update UI on resize
  useVisibleTask$(() => {
    const obs = new ResizeObserver(() => {
      if (startInput.value) setPosition(startInput.value, 'start');
      if (endInput.value) setPosition(endInput.value, 'end');
    });
    obs.observe(slider.value!);
    return () => obs.disconnect();
  });

  const fieldsetAttr = mergeProps<'fieldset'>(attr, cssVariables, {
    id,
    class: 'range',
    ref: slider,
    name: name?.toString(),
  });

  return (
    <fieldset {...fieldsetAttr} >
      <div class="track" ref={track}></div>
      <Slot/>
    </fieldset>
  )
});


export const RangeStart = component$<WithControl<number, InputAttributes>>((props) => {
  const ctx = useContext(RangeContext);
  const { attr, controls } = extractControls(props);
  const { control, onChange, name } = useControlProvider({ name: 'start', ...controls });
  const merged = mergeProps<'input'>(attr as any, {
    type: "range", 
    class: 'he-range-start-input',
  });
  return (
    <>
      <input
        {...merged}
        name={name?.toString()}
        ref={ctx.startInput}
        min={ctx.min}
        max={ctx.max}
        step={ctx.step}
        value={control.value}
        onFocus$={(_, el) => ctx.focusLeft(el)}
        onInput$={(_, el) => ctx.move(el, 'start')}
        onChange$={(_, el) => onChange(el.valueAsNumber)}
        onMouseUp$={ctx.resize}
        onTouchEnd$={ctx.resize}
        onTouchCancel$={ctx.resize}
      />
      <div class="thumb start" data-value={control.value}></div>
    </>
  )
});

export const RangeEnd = component$<WithControl<number, InputAttributes>>((props) => {
  const ctx = useContext(RangeContext);
  const { attr, controls } = extractControls(props);
  const { control, onChange, name } = useControlProvider({ name: 'end', ...controls });
  const merged = mergeProps<'input'>(attr as any, {
    type: "range", 
    class: 'he-range-start-input',
  });
  return (
    <>
      <input
        {...merged}
        name={name?.toString()}
        ref={ctx.endInput}
        min={ctx.min}
        max={ctx.max}
        step={ctx.step}
        value={control.value}
        onFocus$={(_, el) => ctx.focusRight(el)}
        onInput$={(_, el) => ctx.move(el, 'end')}
        onChange$={(_, el) => onChange(el.valueAsNumber)}
        onMouseUp$={ctx.resize}
        onTouchEnd$={ctx.resize}
        onTouchCancel$={ctx.resize}
      />
      <div class="thumb end" data-value={control.value}></div>
    </>
  )
});