import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { ToggleList, ToggleGroup, Toggle, ToggleItem } from "qwik-hueeye";
import { MatIcon } from "../../components";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  const align = useSignal('center');
  const singleMeal = useSignal('pickles');
  const multiMean = useStore([]);
  return <section id="toggle-page" aria-labelledby="toggle-title">
    <h1 id="toggle-title">Toggle</h1>
    <article class="example-1">
      <h2>Select one option</h2>
      <ToggleGroup class="round" bind:value={align}>
        <Toggle value="bottom" class="tooltip" aria-description="Align bottom">
          <MatIcon name="align_vertical_bottom" aria-label="bottom"/>
        </Toggle>
        <Toggle value="center" class="tooltip" aria-description="Align center">
          <MatIcon name="align_vertical_center" aria-label="center"/>
        </Toggle>
        <Toggle value="top" class="tooltip" aria-description="Align top">
          <MatIcon name="align_vertical_top" aria-label="top" />
        </Toggle>
      </ToggleGroup>
    </article>
    <article class="example-2">
      <h2>Vertical options</h2>
      <ToggleGroup class="outline vertical" bind:value={singleMeal}>
        <Toggle value="pickles">Pickles</Toggle>
        <Toggle value="tomatoes">Tomatoes</Toggle>
        <Toggle value="lettuce">Lettuce</Toggle>
        <Toggle value="cheese">Cheese</Toggle>
      </ToggleGroup>
    </article>
    <article class="example-3">
      <h2>Multi options</h2>
      <ToggleList class="fill primary" bind:value={multiMean}>
        <ToggleItem value="pickles">Pickles</ToggleItem>
        <ToggleItem value="tomatoes">Tomatoes</ToggleItem>
        <ToggleItem value="lettuce">Lettuce</ToggleItem>
        <ToggleItem value="cheese">Cheese</ToggleItem>
      </ToggleList>
    </article>

  </section>
})