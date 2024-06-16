import { Slot, component$ } from "@builder.io/qwik";
import { ControlProps, useControlProvider } from "./control";
import { Serializable } from "./types";

export const Controller = component$(function <T extends Serializable>(control: ControlProps<T>) {
  useControlProvider(control);
  return <Slot />
})