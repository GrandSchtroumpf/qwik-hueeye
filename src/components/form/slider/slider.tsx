import { component$, useStyles$, event$, useSignal, $ } from "@builder.io/qwik";
import { useOnReset, clsq } from "../../utils";
import type { InputAttributes } from "../types";
import styles from './slider.scss?inline';

interface SliderProps extends Omit<InputAttributes, 'type' | 'children'> {
  position?: 'start' | 'end';
}

function round(value: number, step: number) {
  return Math.round(value / step) * step;
}

export const Slider = component$((props: SliderProps) => {
  useStyles$(styles);
  const slider = useSignal<HTMLElement>();
  const track = useSignal<HTMLElement>();
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  useOnReset(slider, $(() => {
    const input = slider.value?.querySelector<HTMLInputElement>('input');
    requestAnimationFrame(() => move(null, input!))
  }));

  const move = event$((event: any, input: HTMLInputElement) => {
    const percent = input.valueAsNumber / (max - min);
    const position = percent * (track.value!.clientWidth - 20);
    slider.value?.style.setProperty('--position', `${position}px`);
    input.nextElementSibling?.setAttribute('data-value', `${round(input.valueAsNumber, step)}`);
  });

  return <div class={clsq('slider', props.position)} ref={slider}>
    <div class="track" ref={track}></div>
    <input type="range" {...props} step={step} min={min} max={max} onInput$={move}/>
    <div class="thumb" data-value={props.value ?? min ?? 0}></div>
  </div>
});