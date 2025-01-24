import { implicit$FirstArg, OnVisibleTaskOptions, Signal, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { ExtractOuputResult, WorkerQRL, createWorkerQrl } from "./web-worker";

interface OnWebWorkerOptions extends OnVisibleTaskOptions {
  track?: Signal[],
}

export const useWebWorkerQrl = <O>(
  qrlFn: WorkerQRL<[], O>,
  options?: OnWebWorkerOptions
) => {
  const {
    track = [],
    ...visibleOptions
  } = options ?? {};
  const worker = createWorkerQrl(qrlFn);
  
  // Terminate worker when component is closed
  useTask$(({ cleanup }) => {
    cleanup(() => worker.terminate());
  });

  useVisibleTask$(async (task) => {
    track.forEach(task.track);
    // Cannot use terminate in cleanup because it resolves after
    worker.terminate();
    await worker.create();
  }, visibleOptions);

  return worker;
}

export const useWebWorker$ = implicit$FirstArg(useWebWorkerQrl);

export const useWorkerQrl = <O>(
  qrlFn: WorkerQRL<[], O>,
  options?: OnWebWorkerOptions
) => {
  const {
    track = [],
    ...visibleOptions
  } = options ?? {};
  const worker = createWorkerQrl(qrlFn);
  const signal = useSignal<ExtractOuputResult<O>>();
  
  // Terminate worker when component is closed
  useTask$(({ cleanup }) => {
    cleanup(() => worker.terminate());
  });

  useVisibleTask$(async (task) => {
    track.forEach(task.track);
    // Cannot use terminate in cleanup because it resolves after
    await worker.terminate();
    const result = await worker.create();
    if (result instanceof ReadableStream) {
      // Cannot use async iterator because it's not supported by Safari
      const reader = result.getReader();
      let streaming = true;
      while (streaming) {
        const {done, value} = await reader.read();
        if (done) streaming = false;
        else signal.value = value;
      }
    } else {
      signal.value = result as any;
    }
  }, visibleOptions);

  return signal;
}

export const useWorker$ = implicit$FirstArg(useWorkerQrl);