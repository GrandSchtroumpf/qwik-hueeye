import { component$, useStyles$ } from "@builder.io/qwik";
import { SwitchGroup, Switch } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="switch-page" aria-labelledby="switch-title">
    <h1 id="switch-title">Switch</h1>
    <article>
      <h2>Select one option</h2>
      <SwitchGroup>
        <legend>Meal Options</legend>
        <Switch value="pickles">Pickles</Switch>
        <Switch value="tomatoes">Tomatoes</Switch>
        <Switch value="lettuce">Lettuce</Switch>
        <Switch value="cheese">Cheese</Switch>
      </SwitchGroup>
    </article>
  </section>
})