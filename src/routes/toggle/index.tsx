import { component$, useStyles$ } from "@builder.io/qwik";
import { MultiToggleGroup, ToggleGroup, Toggle } from "qwik-hueeye";
import style from './index.scss?inline';
import { MatIcon } from "../../components";


export default component$(() => {
  useStyles$(style);
  return <section id="toggle-page" aria-labelledby="toggle-title">
    <h1 id="toggle-title">Toggle</h1>
    <article class="example-1">
      <h2>Select one option</h2>
      <ToggleGroup class="round">
        <legend>Align Items</legend>
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
      <ToggleGroup class="outline vertical">
        <legend>Meal Options</legend>
        <Toggle value="pickles">Pickles</Toggle>
        <Toggle value="tomatoes">Tomatoes</Toggle>
        <Toggle value="lettuce">Lettuce</Toggle>
        <Toggle value="cheese">Cheese</Toggle>
      </ToggleGroup>
    </article>
    <article class="example-3">
      <h2>Multi options</h2>
      <MultiToggleGroup class="fill primary">
        <legend>Meal Options</legend>
        <Toggle value="pickles">Pickles</Toggle>
        <Toggle value="tomatoes">Tomatoes</Toggle>
        <Toggle value="lettuce">Lettuce</Toggle>
        <Toggle value="cheese">Cheese</Toggle>
      </MultiToggleGroup>
    </article>

  </section>
})