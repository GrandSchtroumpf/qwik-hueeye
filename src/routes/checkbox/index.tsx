import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { CheckAll, CheckList, CheckItem, Checkbox } from "qwik-hueeye-lib";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  const accepted = useSignal(false);
  const meal = useStore(['tomatoes'])
  return <section id="checkbox-page" aria-labelledby="checkbox-title">
    <h1 id="checkbox-title">Checkbox</h1>
    <article>
      <h2>Single Checkbox</h2>
      <Checkbox bind:value={accepted}>
        Accept conditions {accepted.value ? '✅' : '❌'}
      </Checkbox>
    </article>
    <article>
      <h2>Checklist</h2>
      <h3 id="legend-0">Meal Option</h3>
      <CheckList aria-labelledby="legend-0" bind:value={meal}>
        <CheckItem value="pickles">Pickles</CheckItem>
        <CheckItem value="tomatoes">Tomatoes</CheckItem>
        <CheckItem value="lettuce">Lettuce</CheckItem>
        <CheckItem value="cheese">Cheese</CheckItem>
      </CheckList>
    </article>
    <article>
      <h2>Check all</h2>
      <h3 id="legend-&1">Meal Option</h3>
      <CheckList bind:value={meal}>
        <CheckAll>All options</CheckAll>
        <hr/>
        <CheckItem value="pickles">Pickles</CheckItem>
        <CheckItem value="tomatoes">Tomatoes</CheckItem>
        <CheckItem value="lettuce">Lettuce</CheckItem>
        <CheckItem value="cheese">Cheese</CheckItem>
      </CheckList>
    </article>
  </section>
})