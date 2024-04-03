import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { RadioGroup, Radio } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  const meal = useSignal('pickles');
  return <section id="radio-page" aria-labelledby="radio-title">
    <h1 id="radio-title">Radio</h1>
    <article>
      <h2>Select one option</h2>
      <RadioGroup name="test" bind:value={meal}>
        <legend>Meal Options</legend>
        <Radio value="pickles">Pickles</Radio>
        <Radio value="tomatoes">Tomatoes</Radio>
        <Radio value="lettuce">Lettuce</Radio>
        <Radio value="cheese">Cheese</Radio>
      </RadioGroup>
    </article>
    <article>
      <h2>Vertical options</h2>
      <RadioGroup class="vertical" bind:value={meal}>
        <legend>Meal Options</legend>
        <Radio value="pickles">Pickles</Radio>
        <Radio value="tomatoes">Tomatoes</Radio>
        <Radio value="lettuce">Lettuce</Radio>
        <Radio value="cheese">Cheese</Radio>
      </RadioGroup>
    </article>

  </section>
})