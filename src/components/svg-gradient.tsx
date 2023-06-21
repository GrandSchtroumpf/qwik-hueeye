import { component$ } from "@builder.io/qwik";

export const SvgGradient = component$(() => {
  return <svg hidden aria-hidden="true" focusable="false">
    <linearGradient id="svg-gradient">
      <stop offset="0%" stop-color="var(--gradient-start)" />
      <stop offset="100%" stop-color="var(--gradient-end)" />
    </linearGradient>
  </svg>;
});