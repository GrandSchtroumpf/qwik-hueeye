import { component$, useStyles$, $, useComputed$, PropsOf, useContext, createContextId, useContextProvider, Slot } from "@builder.io/qwik";
import { WithControl, extractControls, useControlProvider } from "../control";
import { mergeProps } from "../../utils/attributes";
import style from './slider.scss?inline';

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

interface Context extends BaseProps {}

const SliderContext = createContextId<Context>('SliderContext');

type Props = Partial<BaseProps> & PropsOf<'div'>;

export const Slider = component$<WithControl<number, Props>>((props) => {
  useStyles$(style);

  const { attr, controls } = extractControls(props);
  const { control, onChange } = useControlProvider(controls);
  const {
    min = 0,
    max = 100,
    step = 1,
    vertical = false,
    disabled = false,
    ...rest
  } = attr;

  useContextProvider(SliderContext, {
    min,
    max,
    step,
    vertical,
    disabled
  });


  const thumb = useComputed$(() => ((control.value ?? min) - min) / (max - min));

  const onKeydown$ = $((e: KeyboardEvent) => {
    const current = control.value ?? min;
    if (e.key === 'Home') onChange(min);
    if (vertical) {
      if (e.key === 'ArrowUp') onChange(Math.max(current - step, min));
      if (e.key === 'ArrowDown') onChange(Math.min(current + step, max));
    } else {
      if (e.key === 'ArrowLeft') onChange(Math.max(current - step, min));
      if (e.key === 'ArrowRight') onChange(Math.min(current + step, max));
    }
    if (e.key === 'End') onChange(max);
  });

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
    const setValue = (percent: number) => {
      onChange(round(min + percent * (max - min)));
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
      
    const percent = getPercent(e);
    setValue(percent);
    if ('touches' in e) {
      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', leave);
    } else {
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', leave);
    }
  });

  const wheel$ = $((e: WheelEvent) => {
    const current = control.value ?? min;
    if (e.deltaY < 0) onChange(Math.max(current - step, min));
    else onChange(Math.min(current + step, max));
  })

  const containerProps = mergeProps<'div'>(rest, {
    role: 'group',
    class: ['he-slider-container', disabled ? 'disable' : ''],
    style: {
      '--he-thumb': thumb.value,
    },
    onMouseDown$: start$,
    onTouchStart$: start$,
    onWheel$: wheel$,
    'preventdefault:wheel': true,
    'preventdefault:touchstart': true,
    'aria-orientation': vertical ? 'vertical' : 'horizontal',
  });

  const btnProps: PropsOf<'button'> = {
    type: 'button',
    disabled: disabled,
    class: 'he-slider-thumb',
    onKeyDown$: onKeydown$,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': control.value ?? min,
  };

  return (
    <div {...containerProps}>
      <div class="he-slider-track"></div>
      <button {...btnProps}>
        <div class="he-slider-thumb-shadow"></div>
        <div class="he-slider-thumb-indicator"></div>
      </button>
      <Slot />
    </div>
  )
});

export const SliderTickList = component$(() => {
  const { min, max, step } = useContext(SliderContext);
  const ticks = [];
  for (let i = min; i <= max; i += step) ticks.push(i);

  return (
    <ul class="he-slider-tick-list">
      {ticks.map(i => <li key={i} class="he-slider-tick"></li>)}
    </ul>
  )
});