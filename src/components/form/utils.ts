import { $ } from "@builder.io/qwik";

export const focusInInputList = $((e: Event, el: HTMLElement) => {
  const active = document.activeElement;
  const inputs = el.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    if (active !== inputs[i]) inputs[i].setAttribute('tabindex', '-1');
  }
});
export const focusOutInputList = $((e: Event, el: HTMLElement) => {
  const input = el.querySelector('input:checked') ?? el.querySelector('input');
  input?.setAttribute('tabindex', '0');
});
