import { component$, createContextId, Slot, useContext, useContextProvider, useTask$, useStyles$, useStore } from "@builder.io/qwik";
import { SvgGradient } from "../svg-gradient";
import { IconConfig, useIconProvider } from "../icons/useIcon";
import { HueEyeSpeculativeRules, useSpeculativeRulesProvider } from "./speculative-rules";
import { HueEyeSession } from "./session";
import style from './hue.scss?inline';
import { isServer } from "@builder.io/qwik/build";


export type HueEyeState = {
  hue?: number;
}

const HueEyeContext = createContextId<HueEyeState>('HueEyeContext');

export const useHueEye = () => useContext(HueEyeContext);

interface HueEyeProps {
  /** IMPORTANT: setting storage to true will download Qwik core at load time */
  storage?: boolean;
  icon?: IconConfig;
  speculativeRules?: boolean;
}

export const HueEyeProvider = component$(({ storage, icon, speculativeRules }: HueEyeProps) => {
  useStyles$(style);
  const state = useStore({
    hue: 0,
  });
  useTask$(({ track }) => {
    const change = track(() => state.hue);
    if (isServer) return;
    if (typeof change === 'undefined') return;
    document.documentElement.style.setProperty('--hue', change.toString());
  });
  useContextProvider(HueEyeContext, state);
  // TODO: remove after useContext is fixed in v2.0
  useContext(HueEyeContext);
  useSpeculativeRulesProvider();
  useIconProvider(icon);
  return <>
    {storage && <HueEyeSession/> }
    <Slot/>
    <SvgGradient/>
    {speculativeRules && <HueEyeSpeculativeRules />}
  </>
});