import { component$, useStyles$, event$, useSignal, useVisibleTask$, Slot } from "@builder.io/qwik";
import { clsq, cssvar } from "../../utils";
import { round } from "./utils";
import { useNameId } from "../field";
import type { FieldsetAttributes } from "../types";
import { ControlValueProps, extractControlProps, useControllerProvider } from "../control";
import styles from './range.scss?inline';

type RangeType = Record<string, number>;
interface RangeProps extends FieldsetAttributes, ControlValueProps<RangeType> {
  min?: number | string;
  max?: number | string;
  step?: number | string;
  startName?: string;
  endName?: string;
}

export const Range = component$((props: RangeProps) => {
  useStyles$(styles);
  const slider = useSignal<HTMLFieldSetElement>();
  const track = useSignal<HTMLElement>();
  const startInput = useSignal<HTMLInputElement>();
  const endInput = useSignal<HTMLInputElement>();
  const baseName = useNameId(props);
  
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;
  const startName = props.startName ?? 'start';
  const endName = props.endName ?? 'end';

  const { bindValue, initialValue } = useControllerProvider(props, { [startName]: min, [endName]: max });
  const initialPosition = {
    start: initialValue[startName] / (max - min),
    end: 1 - initialValue[endName] / (max - min),
  };
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

  return <fieldset {...attr} class={clsq('range', props.class)} ref={slider} {...cssVariables}>
    <Slot/>
    <div class="track" ref={track}></div>
    <input
      type="range" 
      name={`${baseName}.${startName}`}
      ref={startInput}
      min={min}
      max={max}
      step={step}
      value={initialValue[startName]}
      onFocus$={(_, el) => focusLeft(el)}
      onInput$={(_, el) => move(el, 'start')}
      onChange$={(_, el) => bindValue.value = { ...bindValue.value, [startName]: el.valueAsNumber }}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
    />
    <div class="thumb start" data-value={initialValue[startName]}></div>

    <input 
      type="range" 
      name={`${baseName}.${endName}`}
      ref={endInput}
      min={min}
      max={max}
      step={step}
      value={initialValue[endName]}
      onFocus$={(_, el) => focusRight(el)}
      onInput$={(_, el) => move(el, 'end')}
      onChange$={(_, el) => bindValue.value = { ...bindValue.value, [endName]: el.valueAsNumber }}
      onMouseUp$={resize}
      onTouchEnd$={resize}
      onTouchCancel$={resize}
    />
    <div class="thumb end" data-value={initialValue[endName]}></div>
  </fieldset>
});
