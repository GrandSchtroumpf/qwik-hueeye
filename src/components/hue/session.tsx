import { component$, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useHueEye } from "./hue";
import { isServer } from "@builder.io/qwik/build";

const initHue = `
const theme = sessionStorage.getItem('hueeye');
if (theme) {
  const state = JSON.parse(theme);
  if (state.hue) {
    document.documentElement.style.setProperty('--hue', state.hue);
  }
}`;

export const HueEyeSession = component$(() => {
  const state = useHueEye();
  useVisibleTask$(() => {
    const localHue = document.documentElement.style.getPropertyValue('--hue');
    if (localHue) state.hue = Number(localHue);
  });
  useTask$(({ track }) => {
    const change = track(() => state.hue);
    if (isServer) return;
    if (typeof change === 'undefined') return;
    sessionStorage.setItem('hueeye', JSON.stringify({ hue: change }));
  });
  return <script dangerouslySetInnerHTML={initHue}></script>
});
