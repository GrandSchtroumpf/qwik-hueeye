import { component$, Slot } from "@builder.io/qwik";
import { SvgGradient } from "../svg-gradient";
import './hue.scss';


export const HueEyeProvider = component$(() => {
  return <>
    <Slot/>
    <SvgGradient/>
  </>
})