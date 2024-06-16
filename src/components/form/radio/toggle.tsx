import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { BaseRadioGroup, BaseRadioGroupProps, BaseRadio, BaseRadioProps } from "./base";
import { mergeProps } from "../../utils/attributes";
import { WithControl } from "../control";
import { Primitive } from "../types";
import styles from './toggle.scss?inline';

// Use on click
// const animate = sync$((e: Event, el: HTMLElement) => {
//   if (e.target instanceof HTMLInputElement) return; // Late event
//   let target = e.target as HTMLElement;
//   while (!(target instanceof HTMLLabelElement)) {
//     if (!target.parentElement) return;
//     target = target.parentElement;
//   }
//   const current = el.querySelector('input:checked')?.nextElementSibling;
//   if (!current) {
//     // Animate entry
//   } else if (target === current) {
//     // Animate exit
//   } else {
//     const from = current.getBoundingClientRect();
//     const to = target.getBoundingClientRect();
//     const origin = from.left < to.left ? 'left' : 'right';
//     const scaleX = Math.abs(from.left - to.right) / to.width;
//     const x = from.left - to.left;
//     const y = from.top - to.top;
//     el.animate({
//       transform: [`translate(${x}px) scale(1)`, `scale(${scaleX}, 1)`, 'translate(0) scale(1)'],
//       transformOrigin: origin
//     }, {
//       duration: 500,
//       fill: 'both',
//       pseudoElement: '::before'
//     })
//   }
// })

export const ToggleGroup = component$<WithControl<Primitive, BaseRadioGroupProps>>((props) => {
  useStyles$(styles);
  const merged = mergeProps<'div'>(props, {
    class: 'he-toggle-group',
  });
  return <BaseRadioGroup {...merged} toggle>
    <Slot />
  </BaseRadioGroup>
});

export const Toggle = component$<BaseRadioProps>((props) => {
  useStyles$(styles);
  return <div class="he-toggle">
    <BaseRadio {...props}>
      <Slot/>
    </BaseRadio>
  </div>
});