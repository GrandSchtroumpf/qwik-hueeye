import { component$, useStyles$, useSignal, useVisibleTask$, event$ } from "@builder.io/qwik";
import { clsq } from "../../utils";
import { ControlValueProps, extractControlProps, useControlValueProvider } from "../control";
import styles from './slider.scss?inline';

interface SliderProps extends ControlValueProps<number> {
  position?: 'start' | 'end';
  min?: string | number;
  max?: string | number;
  step?: string | number;
  id?: string;
  class?: string;
}

function round(value: number, step: number) {
  return Math.round(value / step) * step;
}

export const Slider = component$((props: SliderProps) => {
  useStyles$(styles);
  const sliderEl = useSignal<HTMLElement>();
  const trackEl = useSignal<HTMLElement>();
  const inputEl = useSignal<HTMLInputElement>();
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;
  const { bindValue } = useControlValueProvider(props, min);
  const attr = extractControlProps(props);

  const move = event$(() => {
    const input = inputEl.value;
    if (!input) return;
    const percent = input.valueAsNumber / (max - min);
    const position = percent * (trackEl.value!.clientWidth - 20);
    sliderEl.value?.style.setProperty('--position', `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${round(input.valueAsNumber, step)}`);
  });

  useVisibleTask$(({ track }) => {
    track(() => bindValue.value);
    if (typeof bindValue.value !== 'number' && !bindValue.value) return;
    move();
  });

  return <div class={clsq('slider', props.position)} ref={sliderEl}>
    <div class="track" ref={trackEl}></div>
    <input {...attr} 
      type="range"
      ref={inputEl}
      step={step}
      min={min}
      max={max}
      value={bindValue.value}
      onInput$={move}
      onChange$={(e, i) => bindValue.value = i.valueAsNumber}
    />
    <div class="thumb" data-value={bindValue.value ?? min ?? 0}></div>
  </div>
});