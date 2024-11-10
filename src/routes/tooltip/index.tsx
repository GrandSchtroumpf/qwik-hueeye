import { component$ } from "@builder.io/qwik";
import { Tooltip } from "qwik-hueeye-lib";

export default component$(() => {
  return <section id="tooltip-page" aria-labelledby="tooltip-title">
    <h1 id="tooltip-title">Tooltip</h1>
    <article>
      <Tooltip.Root area="top">
        <Tooltip.Trigger class="he-btn">
          Top
        </Tooltip.Trigger>
        <Tooltip.Panel>
          This is a tooltip
        </Tooltip.Panel>
      </Tooltip.Root>
      <Tooltip.Root area="right">
        <Tooltip.Trigger class="he-btn">
          Right
        </Tooltip.Trigger>
        <Tooltip.Panel>
          This is a tooltip
        </Tooltip.Panel>
      </Tooltip.Root>
      <Tooltip.Root area="bottom">
        <Tooltip.Trigger class="he-btn">
          Bottom
        </Tooltip.Trigger>
        <Tooltip.Panel>
          This is a tooltip
        </Tooltip.Panel>
      </Tooltip.Root>
      <Tooltip.Root area="left">
        <Tooltip.Trigger class="he-btn">
          Left
        </Tooltip.Trigger>
        <Tooltip.Panel>
          This is a tooltip
        </Tooltip.Panel>
      </Tooltip.Root>

    </article>
  </section>
})