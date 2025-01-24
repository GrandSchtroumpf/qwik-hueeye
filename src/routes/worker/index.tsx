import { component$, useSignal } from "@builder.io/qwik";
import { useWebWorker$, useWorker$ } from "../../components/worker/useWebWorker";

export default component$(() => {
  const count = useSignal(0);
  const worker = useWebWorker$<string>((worker) => {
    const { postMessage, onmessage, cleanup } = worker;
    onmessage((content) => {
      console.log('Received message', content);
      console.log('counter', count.value);
      postMessage('Hello from worker');
    });
    const i = setInterval(() => console.log('interval', count.value), 1000);
    cleanup(() => clearInterval(i));
  }, {
    track: [count],
  });

  const result = useWorker$<string>(async function*() {
    yield '1';
    await new Promise(res => setTimeout(res, 3000));
    yield '2';
  });

  return <>
    <button onClick$={() => worker.postMessage('Coucou')}>Post Message</button>
    <button onClick$={() => count.value++}>Counter</button>
    {result.value}
  </>
})