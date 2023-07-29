import { QRL, Signal, useSignal, useTask$ } from "@builder.io/qwik";

export function useOnChange<T>(signal: Signal<T>, cb: QRL<(value: T) => any>) {
  const count = useSignal(0);
  useTask$(({ track }) => {
    const change = track(() => signal.value);
    if (count.value) cb(change);
    count.value++;
  })
}
