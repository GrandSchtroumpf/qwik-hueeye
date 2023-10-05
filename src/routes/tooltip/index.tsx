import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return <section id="tooltip-page" aria-labelledby="tooltip-title">
    <h1 id="tooltip-title">Tooltip</h1>
    <article>
      <button class="btn tooltip-top" aria-description="This is a tooltip">
        Top
      </button>
      <button class="btn tooltip-right" aria-description="This is a tooltip">
        Right
      </button>
      <button class="btn tooltip-bottom" aria-description="This is a tooltip">
        Bottom
      </button>
      <button class="btn tooltip-left" aria-description="This is a tooltip">
        Left
      </button>
    </article>
  </section>
})