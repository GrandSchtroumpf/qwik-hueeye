import { component$, createContextId, Signal, Slot, useContext, useContextProvider, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { SvgGradient } from "../svg-gradient";
import './hue.scss';

interface HueEyeState {
  hue: Signal<number | string | undefined>;
}

const HueEyeSession = component$(() => {
  const { hue } = useContext(HueEyeContext);
  
  // Add script to head once this is released
  // https://github.com/BuilderIO/qwik/issues/2593
  useVisibleTask$(() => {
    if (!history.length) return;
    const theme = sessionStorage.getItem('hueeye');
    if (!theme) return;
    const state = JSON.parse(theme);
    if (!state.hue) return;
    hue.value = state.hue;
    document.documentElement.style.setProperty('--hue', state.hue);
  });

  useVisibleTask$(({ track }) => {
    const change = track(() => hue.value);
    if (typeof change === 'undefined') return;
    sessionStorage.setItem('hueeye', JSON.stringify({ hue: change }));
  });
  return <></>
});

const HueEyeContext = createContextId<HueEyeState>('HueEyeContext');

export const useHueEye = () => useContext(HueEyeContext);

interface HueEyeProps {
  storage?: boolean;
}

export const HueEyeProvider = component$(({ storage }: HueEyeProps) => {
  const state: HueEyeState = {
    hue: useSignal()
  };
  useVisibleTask$(({ track }) => {
    const change = track(() => state.hue.value);
    if (typeof change === 'undefined') return;
    document.documentElement.style.setProperty('--hue', change.toString());
  });
  useContextProvider(HueEyeContext, state);
  return <>
    {storage && <HueEyeSession/> }
    <Slot/>
    <SvgGradient/>
  </>
});