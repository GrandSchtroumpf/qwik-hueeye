import { Slot, component$, useStyles$, event$, useSignal, useVisibleTask$, createContextId, useContextProvider, useContext, $, useId } from "@builder.io/qwik";
import { useOnReset, clsq } from "../../utils";
import type { FieldsetAttributes, InputAttributes } from "../types";
import styles from './range.scss?inline';

interface RangeProps extends FieldsetAttributes {
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

const RangeContext = createContextId<RangeService>('RangeContext');
const useRangeContext = () => useContext(RangeContext);

type RangeService = ReturnType<typeof useRangeProvider>;

function useRangeProvider(props: RangeProps) {
  const slider = useSignal<HTMLFieldSetElement>();
  const track = useSignal<HTMLElement>();
  const startInput = useSignal<HTMLInputElement>();
  const endInput = useSignal<HTMLInputElement>();
  const nameId = props.name ?? useId();
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  /** Set the position of the thumb & track for the input */
  const setPosition = event$((input: HTMLInputElement, mode: 'start' | 'end') => {
    const percent = input.valueAsNumber / (max - min);
    // total width - inline padding - thumb size
    const distance = track.value!.clientWidth - 20;
    const position = mode === 'start' ? percent * distance : (percent - 1) * distance;
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

  const service = {
    nameId,
    slider,
    track,
    startInput,
    endInput,
    min,
    max,
    step,
    focusLeft,
    focusRight,
    resize,
    move,
    setPosition
  }
  useContextProvider(RangeContext, service);
  return service;
}

export const Range = component$((props: RangeProps) => {
  useStyles$(styles);
  const { slider, track, setPosition } = useRangeProvider(props);

  // Update UI on resize
  useVisibleTask$(() => {
    const obs = new ResizeObserver(() => {
      const inputs = slider.value?.querySelectorAll<HTMLInputElement>('input');
      setPosition(inputs!.item(0), 'start');
      setPosition(inputs!.item(1), 'end');
    });
    obs.observe(slider.value!);
    return () => obs.disconnect();
  });
  

  // Update position on reset
  useOnReset(slider, $(() => {
    const inputs = slider.value?.querySelectorAll<HTMLInputElement>('input');
    const start = inputs!.item(0);
    const end = inputs!.item(1);
    start.value = start.min;
    end.value = end.max;
    setPosition(start, 'start');
    setPosition(end, 'end');
  }));

  return <fieldset {...props} class={clsq('range', props.class)} ref={slider}>
    <div class="track" ref={track}></div>
    <Slot/>
  </fieldset>
});

interface ThumbProps extends Omit<InputAttributes, 'type' | 'children' | 'step' | 'min' | 'max'> {}

export const ThumbStart = component$((props: ThumbProps) => {
  const { nameId, startInput, min, max, step, resize, focusLeft, move} = useRangeContext();
  return <>
    <input
      type="range" 
      name={nameId + '.start'}
      ref={startInput}
      min={min}
      max={max}
      step={step}
      value={min}
      onFocus$={(_, el) => focusLeft(el)}
      onInput$={(_, el) => move(el, 'start')}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb start" data-value={min}></div>
  </>

});
export const ThumbEnd = component$((props: ThumbProps) => {
  const { nameId, endInput, min, max, step, resize, focusRight, move} = useRangeContext();
  return <>
    <input 
      type="range" 
      name={nameId + '.end'}
      ref={endInput}
      min={min}
      max={max}
      step={step}
      value={max}
      onFocus$={(_, el) => focusRight(el)}
      onInput$={(_, el) => move(el, 'end')}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb end" data-value={max}></div>
  </>
});