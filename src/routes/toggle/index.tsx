import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { ToggleList, ToggleGroup, Toggle, ToggleItem } from "qwik-hueeye-lib";
import { MatIcon } from "../../components";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  const align = useSignal('center');
  const multiMean = useStore([]);
  const radius = useSignal<'round' | 'flat' | ''>('');
  return (
    <section class={radius} id="toggle-page" aria-labelledby="toggle-title">
      <h1 id="toggle-title">Toggle</h1>
      <article class="example-1">
        <h2>Select one option</h2>
        <ToggleGroup bind:value={align}>
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
        <ToggleGroup name="a">
          <Toggle value="bottom" class="tooltip">
            Small text
          </Toggle>
          <Toggle value="center" class="tooltip">
            Long text with content
          </Toggle>
          <Toggle value="top" class="tooltip" >
            xs
          </Toggle>
        </ToggleGroup>
      </article>
      <article class="example-3">
        <h2>Multi options</h2>
        <ToggleList class="primary" bind:value={multiMean}>
          <ToggleItem value="pickles">Pickles</ToggleItem>
          <ToggleItem value="tomatoes">Tomatoes</ToggleItem>
          <ToggleItem value="lettuce">Lettuce</ToggleItem>
          <ToggleItem value="cheese">Cheese</ToggleItem>
        </ToggleList>
      </article>
      <ToggleGroup bind:value={radius}>
        <Toggle value="flat">Flat</Toggle>
        <Toggle value="">Normal</Toggle>
        <Toggle value="round">Round</Toggle>
      </ToggleGroup>
    </section>

  )
})