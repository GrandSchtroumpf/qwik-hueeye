import { component$, useStyles$ } from "@builder.io/qwik";
import { SwitchGroup, SwitchItem } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="switch-page" aria-labelledby="switch-title">
    <h1 id="switch-title">Switch</h1>
    <article>
      <h2>Select one option</h2>
      <SwitchGroup>
        <legend>Meal Options</legend>
        <SwitchItem value="pickles">Pickles</SwitchItem>
        <SwitchItem value="tomatoes">Tomatoes</SwitchItem>
        <SwitchItem value="lettuce">Lettuce</SwitchItem>
        <SwitchItem value="cheese">Cheese</SwitchItem>
      </SwitchGroup>
    </article>
  </section>
})