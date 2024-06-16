import { component$, useStyles$, useSignal, event$, PropsOf, untrack } from "@builder.io/qwik";
import { cssvar } from "../../utils";
import { round } from "./utils";
import { mergeProps } from "../../utils/attributes";
import { WithControl, extractControls, useControlProvider } from "../control";
import { useWithId } from "../../hooks/useWithId";
import styles from './slider.scss?inline';

interface SliderProps extends PropsOf<'div'> {
  position?: 'start' | 'end';
  min?: string | number;
  max?: string | number;
  step?: string | number;
  id?: string;
  class?: string;
}


export const Slider = component$<WithControl<number, SliderProps>>((props) => {
  useStyles$(styles);
  const id = useWithId(props.id);
  const { attr, controls } = extractControls(props);
  const { control, onChange, name } = useControlProvider(controls);
  const sliderEl = useSignal<HTMLElement>();
  const trackEl = useSignal<HTMLElement>();
  const min = props.min ? Number(props.min) : 0;
  const max = props.max ? Number(props.max) : 100;
  const step = props.step ? Number(props.step) : 1;

  const initialPosition = untrack(() => (control.value ?? 0) / (max - min));
  
  const move = event$((e: any, input: HTMLInputElement) => {
    const percent = input.valueAsNumber / (max - min) - initialPosition;
    const value = input ? percent * (trackEl.value!.clientWidth - 20) : 0;
    sliderEl.value?.style.setProperty('--position', `${round(value, 1)}px`);
    input.nextElementSibling?.setAttribute('data-value', `${round(input.valueAsNumber, step)}`);
  });
  
  const sliderAttr = mergeProps<'div'>(
    attr,
    { class: 'slider' },
    { class: props.position },
    cssvar({ initialPosition }),
  )

  return <div ref={sliderEl} {...sliderAttr }>
    <div class="track" ref={trackEl}></div>
    <input
      id={id}
      name={name?.toString()}
      type="range"
      step={step}
      min={min}
      max={max}
      value={control.value ?? 0}
      onInput$={move}
      onChange$={(e, i) => onChange(i.valueAsNumber)}
    />
    <div class="thumb" data-value={control.value ?? 0}></div>
  </div>
});