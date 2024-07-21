import { OnVisibleTaskOptions, QRL, Signal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { QwikWorker, webWorkerQrl } from "./web-worker";

interface OnWebWorkerOptions<T> extends OnVisibleTaskOptions {
  track?: Signal[],
  onMessage$?: QRL<(args: T) => any>;
  worker$: QRL<(args: QwikWorker<T>) => any>;
}

export const useWebWorker = <T = unknown>(opt: OnWebWorkerOptions<T>) => {
  const {
    track = [],
    onMessage$,
    worker$,
    ...visibleOptions
  } = opt;

  const worker = webWorkerQrl(worker$);
  
  // Terminate worker when component is closed
  useTask$(() => worker.terminate);

  useVisibleTask$(async (task) => {
    track.forEach(task.track);
    worker.close();
    worker.create();
    if (onMessage$) return worker.onMessage$(onMessage$);
  }, visibleOptions);

  return worker;
}
