import { $, component$ } from "@builder.io/qwik";
import { Toaster, ToastNode, useToasterProvider } from "qwik-hueeye-lib";

export default component$(() => {
  const {add, remove} = useToasterProvider();
  const customToast: ToastNode = $((props) => <>
    <span>Custom</span>
    <button class="btn primary" onClick$={() => remove(props.id)}>Close</button>
  </>);
  return <>
    <section id="toaster-page" aria-labelledby="toaster-title">
      <h1 id="toaster-title">Open Toaster</h1>
      <article>
        <button class="btn primary" onClick$={() => add('Hello', { position: 'start' })}>
          Start
        </button>
        <button class="btn gradient" onClick$={() => add('Hello')}>
          Center
        </button>
        <button class="btn secondary" onClick$={() => add('Hello', { position: 'end' })}>
          End
        </button>
        <button class="btn secondary" onClick$={() => add(customToast, { duration: 2000 })}>
          Custom
        </button>
      </article>
    </section>
    <Toaster/>
  </>
})