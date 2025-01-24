import { implicit$FirstArg, OnVisibleTaskOptions, QRL, Signal, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { QwikWorker, webWorkerQrl } from "./web-worker";

interface OnWebWorkerOptions extends OnVisibleTaskOptions {
  track?: Signal[],
}

export const useWebWorkerQrl = <T = unknown>(
  qrlFn: QRL<(args: QwikWorker<T>) => any>,
  options?: OnWebWorkerOptions
) => {
  const {
    track = [],
    ...visibleOptions
  } = options ?? {};
  const worker = webWorkerQrl(qrlFn);
  
  // Terminate worker when component is closed
  useTask$(({ cleanup }) => {
    cleanup(() => worker.terminate());
  });

  useVisibleTask$(async (task) => {
    track.forEach(task.track);
    // Cannot use terminate in cleanup because it resolves after
    await worker.terminate();
    await worker.create();
  }, visibleOptions);

  return worker;
}

export const useWebWorker$ = implicit$FirstArg(useWebWorkerQrl);

export const useWorkerQrl = <T = unknown>(
  qrlFn: QRL<(args: QwikWorker<T>) => any>,
  options?: OnWebWorkerOptions
) => {
  const {
    track = [],
    ...visibleOptions
  } = options ?? {};
  const worker = webWorkerQrl(qrlFn);
  const signal = useSignal<T>();
  
  // Terminate worker when component is closed
  useTask$(({ cleanup }) => {
    cleanup(() => worker.terminate());
  });

  useVisibleTask$(async (task) => {
    track.forEach(task.track);
    // Cannot use terminate in cleanup because it resolves after
    await worker.terminate();
    const stream = await worker.create();
    // Cannot use async iterator because it's not supported by Safari
    const reader = stream.getReader();
    let streaming = true;
    while (streaming) {
      const {done, value} = await reader.read();
      if (done) streaming = false;
      else signal.value = value;
    }
  }, visibleOptions);

  return signal;
}

export const useWorker$ = implicit$FirstArg(useWorkerQrl);