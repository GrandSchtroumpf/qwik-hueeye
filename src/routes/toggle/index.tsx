import { component$, useStyles$ } from "@builder.io/qwik";
import { ToggleGroup, Toggle } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="toggle-page" aria-labelledby="toggle-title">
    <h1 id="toggle-title">Toggle</h1>
    <article>
      <h2>Select one option</h2>
      <ToggleGroup onValueChange$={v => console.log(v)}>
        <legend>Meal Options</legend>
        <Toggle value="pickles">Pickles</Toggle>
        <Toggle value="tomatoes">Tomatoes</Toggle>
        <Toggle value="lettuce">Lettuce</Toggle>
        <Toggle value="cheese">Cheese</Toggle>
      </ToggleGroup>
    </article>
    <article>
      <h2>Vertical options</h2>
      <ToggleGroup class="vertical">
        <legend>Meal Options</legend>
        <Toggle value="pickles">Pickles</Toggle>
        <Toggle value="tomatoes">Tomatoes</Toggle>
        <Toggle value="lettuce">Lettuce</Toggle>
        <Toggle value="cheese">Cheese</Toggle>
      </ToggleGroup>
    </article>

  </section>
})