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
  onclose: (cb) => msgCallbacks.add(cb),
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
    if (type === 'init') {
      const [qrl] = _deserializeData(params, containerEl);
      const output = await qrl.apply(self, [props]);
      if (typeof output === 'function') closeCallbacks.add(output);
      self.postMessage([type, requestId, true]);
    }
    if (type === 'message') {
      const args = _deserializeData(params, containerEl);
      msgCallbacks.forEach(cb => cb(args));
      self.postMessage([type, requestId, true]);
    }
    if (type === 'close') {
      closeCallbacks.forEach(cb => cb());
      msgCallbacks.clear();
      closeCallbacks.clear();
    }
  } catch (err) {
    console.error(err);
    self.postMessage([requestId, false, err]);
    return;
  }
};