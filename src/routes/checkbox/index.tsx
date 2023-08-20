import { component$, useStyles$ } from "@builder.io/qwik";
import { CheckAll, CheckList, CheckItem, Checkbox } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="checkbox-page" aria-labelledby="checkbox-title">
    <h1 id="checkbox-title">Checkbox</h1>
    <article>
      <h2>Single Checkbox</h2>
      <Checkbox>
        Accept conditions
      </Checkbox>
    </article>
    <article>
      <h2>Checklist</h2>
      <CheckList>
        <legend>Meal Options</legend>
        <CheckItem value="pickles">Pickles</CheckItem>
        <CheckItem value="tomatoes">Tomatoes</CheckItem>
        <CheckItem value="lettuce">Lettuce</CheckItem>
        <CheckItem value="cheese">Cheese</CheckItem>
      </CheckList>
    </article>
    <article>
      <h2>Check all</h2>
      <CheckList value={['tomatoes']}>
        <legend>Meal Options</legend>
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