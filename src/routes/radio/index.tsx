import { component$, useStyles$ } from "@builder.io/qwik";
import { RadioGroup, Radio } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="radio-page" aria-labelledby="radio-title">
    <h1 id="radio-title">Radio</h1>
    <article>
      <h2>Select one option</h2>
      <RadioGroup onValueChange$={v => console.log(v)}>
        <legend>Meal Options</legend>
        <Radio value="pickles">Pickles</Radio>
        <Radio value="tomatoes">Tomatoes</Radio>
        <Radio value="lettuce">Lettuce</Radio>
        <Radio value="cheese">Cheese</Radio>
      </RadioGroup>
    </article>

  </section>
})