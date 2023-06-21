import { component$, Slot } from "@builder.io/qwik";

export const If = component$(({ cdt }: { cdt: boolean }) => {
  if (cdt) return <Slot/>
  return <></>
});