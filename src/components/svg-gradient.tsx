import { component$ } from "@builder.io/qwik";

export const SvgGradient = component$(() => {
  return <svg style="position:fixed; top: -1000px; opacity: 0; pointer-event: none" aria-hidden="true" focusable="false">
    <linearGradient id="svg-gradient">
      <stop offset="0%" stop-color="var(--gradient-start)" />
      <stop offset="100%" stop-color="var(--gradient-end)" />
    </linearGradient>
  </svg>;
});