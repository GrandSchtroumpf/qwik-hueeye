import { Slot, component$, useStyles$, event$, useSignal, useVisibleTask$, createContextId, useContextProvider, useContext } from "@builder.io/qwik";
import { clsq } from "../../utils";
import { useNameId } from "../field";
import type { FieldsetAttributes, InputAttributes } from "../types";
import styles from './range.scss?inline';
import { ControlValueProps, extractControlProps, useControlValue, useControllerProvider } from "../control";

interface Range {
  start: number;
  end: number;
}
interface RangeProps extends FieldsetAttributes, ControlValueProps<Range> {
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
  const baseName = useNameId(props);
  
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
    baseName,
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



// TODO: use style attribute instead of JS properties to set width & position

export const Range = component$((props: RangeProps) => {
  useStyles$(styles);
  const { baseName, slider, track, setPosition, min, max } = useRangeProvider(props);
  const { bindValue } = useControllerProvider(props, { start: min, end: max });
  const attr = extractControlProps(props);

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
  
  useVisibleTask$(({ track }) => {
    track(() => bindValue.value?.start);
    const input = slider.value?.querySelector<HTMLInputElement>(`input[name="${baseName}.start"]`);
    if (input) setPosition(input, 'start');
  })
  useVisibleTask$(({ track }) => {
    track(() => bindValue.value?.end);
    const input = slider.value?.querySelector<HTMLInputElement>(`input[name="${baseName}.end"]`);
    if (input) setPosition(input, 'end');
  })

  return <fieldset {...attr} class={clsq('range', props.class)} ref={slider}>
    <div class="track" ref={track}></div>
    <Slot/>
  </fieldset>
});

interface ThumbProps extends Omit<InputAttributes, 'type' | 'children' | 'step' | 'min' | 'max'> {}

export const ThumbStart = component$((props: ThumbProps) => {
  const { baseName, startInput, min, max, step, resize, focusLeft, move} = useRangeContext();
  const name = baseName + '.start';
  const bindValue = useControlValue<Range>();
  console.log(bindValue.value);
  return <>
    <input
      type="range" 
      name={name}
      ref={startInput}
      min={min}
      max={max}
      step={step}
      value={bindValue.value.start}
      onFocus$={(_, el) => focusLeft(el)}
      onInput$={(_, el) => move(el, 'start')}
      onChange$={(_, el) => bindValue.value = { ...bindValue.value, start: el.valueAsNumber }}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb start" data-value={bindValue.value.start}></div>
  </>

});
export const ThumbEnd = component$((props: ThumbProps) => {
  const { baseName, endInput, min, max, step, resize, focusRight, move} = useRangeContext();
  const name = baseName + '.end';
  const bindValue = useControlValue<Range>();

  return <>
    <input 
      type="range" 
      name={name}
      ref={endInput}
      min={min}
      max={max}
      step={step}
      value={bindValue.value.end}
      onFocus$={(_, el) => focusRight(el)}
      onInput$={(_, el) => move(el, 'end')}
      onChange$={(_, el) => bindValue.value = { ...bindValue.value, end: el.valueAsNumber }}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
      {...props} />
    <div class="thumb end" data-value={bindValue.value.end}></div>
  </>
});