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

const getWorker = (qrl: QRL) => {
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
};

type Callback<T> = (args: T) => any | QRL<(args: T) => any>;

export interface QwikWorker<Message> {
  onmessage: (cb: Callback<Message>) => any;
  onclose: (cb: Callback<void>) => any;
  postMessage: QRL<(data: Message) => any>;
}

export const webWorkerQrl = <T = unknown>(qrl: QRL<(this: any, props: QwikWorker<T>) => any>) => {
  const sendMessage = $((type: 'init' | 'close' | 'message', data?: string) => {
    const worker = getWorker(qrl);
    const ctxElement = (_getContextElement() as HTMLElement | undefined);
    const containerEl = ctxElement?.closest('[q\\:container]') ?? document.documentElement;
    const qbase = containerEl.getAttribute('q:base') ?? '/';
    const baseURI = document.baseURI;
    const requestId = getWorkerRequest();  
    worker.postMessage([type, requestId, baseURI, qbase, data]);
  })

  const create = $(async () => {
    const data = await _serializeData([qrl], false);
    sendMessage('init', data);
  });

  /** Post message to web worker instance */
  const postMessage = $(async (...args: any[]) => {  
    const data = await _serializeData(args, false);
    sendMessage('message', data);
  });

  /** Close current process be do not use */
  const close = $(() => sendMessage('close'))

  /** Register callback when worker post message to main thread */
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