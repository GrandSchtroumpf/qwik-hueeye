import { QRL, Signal, useTask$ } from "@builder.io/qwik";

export function useEffect<T>(signal: Signal<T>, cb: QRL<(value: T) => any>) {
  useTask$(({ track }) => {
    track(() => signal.value);
    cb(signal.value);
  })
}
