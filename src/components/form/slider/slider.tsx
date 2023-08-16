import { component$, useStyles$, useSignal, event$ } from "@builder.io/qwik";
import { clsq, cssvar } from "../../utils";
import { round } from "./utils";
import { ControlValueProps, extractControlProps, useControllerProvider } from "../control";
import styles from './slider.scss?inline';

interface SliderProps extends ControlValueProps<number> {
  position?: 'start' | 'end';
  min?: string | number;
  max?: string | number;
  step?: string | number;
  id?: string;
  class?: string;
}



export const Slider = component$((props: SliderProps) => {
  useStyles$(styles);
  const sliderEl = useSignal<HTMLElement>();
  const trackEl = useSignal<HTMLElement>();
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;
  const { bindValue, initialValue } = useControllerProvider(props, min);
  const attr = extractControlProps(props);
  const initialPosition = initialValue / (max - min);

  const move = event$((e: any, input: HTMLInputElement) => {
    const percent = input.valueAsNumber / (max - min) - initialPosition;
    const value = input ? percent * (trackEl.value!.clientWidth - 20) : 0;
    sliderEl.value?.style.setProperty('--position', `${round(value, 1)}px`);
    input.nextElementSibling?.setAttribute('data-value', `${round(input.valueAsNumber, step)}`);
  });

  return <div ref={sliderEl} class={clsq('slider', props.position)} {...cssvar({ initialPosition })}>
    <div class="track" ref={trackEl}></div>
    <input {...attr} 
      type="range"
      step={step}
      min={min}
      max={max}
      value={initialValue}
      onInput$={move}
      onChange$={(e, i) => bindValue.value = i.valueAsNumber}
    />
    <div class="thumb" data-value={initialValue}></div>
  </div>
});