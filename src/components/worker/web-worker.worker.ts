import { $, _deserializeData } from '@builder.io/qwik';
import { QwikWorker } from './web-worker';

globalThis.document = {
  nodeType: 9,
  ownerDocument: null,
  dispatchEvent() {
    return true;
  },
  createElement() {
    return {
      nodeType: 1,
    } as any;
  },
} as any;

const msgCallbacks = new Set<(...args: any[]) => any>();
const closeCallbacks = new Set<() => any>();

const props: QwikWorker<unknown> = {
  // Marking it as QRL rerender the worker for some reason
  onmessage: (cb) => msgCallbacks.add(cb),
  cleanup: (cb) => closeCallbacks.add(cb),
  postMessage: $((...args: any[]) => self.postMessage(['onmessage', ...args])),
}

globalThis.onmessage = async ({ data }) => {
  const [type, requestId, baseURI, qBase, params] = data;
  const containerEl = {
    nodeType: 1,
    ownerDocument: {
      baseURI,
    },
    closest() {
      return containerEl;
    },
    getAttribute(name: string) {
      return name === 'q:base' ? qBase : undefined;
    },
  };
  try {
    if (type === 'apply') {
      const [qrl] = _deserializeData(params, containerEl);
      const output = await qrl.apply(self, [props]);
      // Add cleanup callback if output is a function
      if (typeof output === 'function') {
        closeCallbacks.add(output);
        return self.postMessage([type, requestId, { status: 'success', done: true }]);
      }
      
      // If function is an iterator and not an array iterate over it
      isObject: if (typeof output === 'object') {
        if (Array.isArray(output)) break isObject;
        if (Symbol.iterator in output || Symbol.asyncIterator in output) {
          for await (const result of output) {
            console.log(result);
            self.postMessage([type, requestId, { status: 'success', result, done: false }]);
          }
          return self.postMessage([type, requestId, { status: 'success', done: true }]);
        }
      }
      // We need to emit twice because ReadableStream emit last close() event with undefined value
      self.postMessage([type, requestId, { status: 'success', result: output, done: false }])
      self.postMessage([type, requestId, { status: 'success', done: true }]);
    }
    if (type === 'message') {
      const args = _deserializeData(params, containerEl);
      msgCallbacks.forEach(cb => cb(args));
      self.postMessage([type, requestId, { status: 'success' }]);
    }
    if (type === 'close') {
      closeCallbacks.forEach(cb => cb());
      msgCallbacks.clear();
      closeCallbacks.clear();
      self.postMessage([type, requestId, { status: 'success' }]);
    }
  } catch (err) {
    console.error(err);
    self.postMessage([type, requestId, { status: 'error', result: err }]);
    return;
  }
};