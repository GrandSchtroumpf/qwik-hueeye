import { component$, useSignal, $ } from "@builder.io/qwik";
import { useWebWorker } from "../../components/worker/useWebWorker";

export default component$(() => {
  const count = useSignal(0);
  const { postMessage } = useWebWorker<string>({
    track: [count],
    worker$: $((worker) => {
      const { postMessage, onmessage } = worker;
      onmessage((content) => {
        console.log('Received message', content);
        console.log('counter', count.value);
        postMessage('Hello from worker');
      });
      const i = setInterval(() => console.log('interval', count.value), 1000);
      return () => clearInterval(i);
    }),
    onMessage$: $((message) => {
      console.log('message from the worker', message);
    }),
  });

  return <>
    <button onClick$={() => postMessage('Coucou')}>Post Message</button>
    <button onClick$={() => count.value++}>Counter</button>
  </>
})