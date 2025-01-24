import {
  $,
  implicit$FirstArg,
  type QRL,
  _getContextElement,
  _serializeData,
} from '@builder.io/qwik';

//@ts-ignore
import workerUrl from './web-worker.worker.ts?worker&url';

const qwikWorkers = new Map<string, Worker>();
let workerRequests = 0;

const getWorkerRequest = () => ++workerRequests;

const createWorker = (qrl: QRL) => {
  let worker = qwikWorkers.get(qrl.getHash());
  if (!worker) {
    qwikWorkers.set(
      qrl.getHash(),
      (worker = new Worker(workerUrl, {
        name: `worker$(${qrl.getSymbol()})`,
        type: 'module',
      }))
    );
  }
  return worker;
}
const getWorker = (qrl: QRL) => {
  const worker = qwikWorkers.get(qrl.getHash());
  if (!worker) throw new Error('[QwikWorker] Try to access Web Worker before it is created');
  return worker;
};

type Callback<T> = (args: T) => any | QRL<(args: T) => any>;

export interface QwikWorker<Message> {
  onmessage: (cb: Callback<Message>) => any;
  cleanup: (cb: Callback<void>) => any;
  postMessage: QRL<(data: Message) => any>;
}

export const webWorkerQrl = <T = unknown>(qrl: QRL<(this: any, props: QwikWorker<T>) => any>) => {

  const sendMessage = $((type: 'apply' | 'close' | 'message', data?: string) => {
    const worker = getWorker(qrl);
    const ctxElement = (_getContextElement() as HTMLElement | undefined);
    const containerEl = ctxElement?.closest('[q\\:container]') ?? document.documentElement;
    const qbase = containerEl.getAttribute('q:base') ?? '/';
    const baseURI = document.baseURI;
    const requestId = getWorkerRequest();
    return new ReadableStream({
      start(controller) {
        const handler = ({ data }: MessageEvent) => {
          if (!Array.isArray(data)) return;
          if (data[0] !== type) return;
          if (data[1] !== requestId) return;
          const { status, result, done } = data[2];
          if (status !== 'success') {
            controller.error(result);
          }
          if (done) {
            worker.removeEventListener('message', handler)
            controller.close();
          } else {
            controller.enqueue(result);
          }
        };
        worker.addEventListener('message', handler);
        worker.postMessage([type, requestId, baseURI, qbase, data]);
      }
    });
  });
  
  /** 
   * Create the worker and apply qrl callback.
   */
  const create = $(async () => {
    createWorker(qrl)
    const data = await _serializeData([qrl], false);
    return sendMessage('apply', data);
  });


  /** Post message to web worker instance */
  const postMessage = $(async (...args: any[]) => {  
    const data = await _serializeData(args, false);
    return sendMessage('message', data);
  });

  /** Clear current callbacks but keep the worker alive for future message */
  const close = $(() => sendMessage('close'))

  /**
   * Register callback when worker post message to main thread
   * @param cb The callback to run when message arrives
   * @returns unsubscribe function
   */
  const onMessage$ = $((cb: (...args: any[]) => any) => {
    const worker = getWorker(qrl);
    const handler = ({ data }: MessageEvent) => {
      if (!Array.isArray(data)) return;
      const [type, ...args] = data;
      if (type !== 'onmessage') return;
      cb(...args);
    };
    worker.addEventListener('message', handler);
    return () => worker.removeEventListener('message', handler);
  });


  /** Terminate the worker process */
  const terminate = $(() => {
    qwikWorkers.get(qrl.getHash())?.terminate();
    qwikWorkers.delete(qrl.getHash());
  });

  return {
    create,
    onMessage$,
    postMessage,
    close,
    terminate
  };
};

export const webWorker$ = implicit$FirstArg(webWorkerQrl);