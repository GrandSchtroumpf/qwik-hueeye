import { component$, useStyles$ } from "@builder.io/qwik";
import { CheckAll, CheckGroup, CheckItem, CheckList, Checkbox } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="checkbox-page" aria-labelledby="checkbox-title">
    <h1 id="checkbox-title">Checkbox</h1>
    <article>
      <h2>Checklist</h2>
      <CheckGroup>
        <legend>Meal Options</legend>
        <Checkbox value="pickles">Pickles</Checkbox>
        <Checkbox value="tomatoes">Tomatoes</Checkbox>
        <Checkbox value="lettuce">Lettuce</Checkbox>
        <Checkbox value="cheese">Cheese</Checkbox>
      </CheckGroup>
    </article>
    <article>
      <h2>Checklist with check all</h2>
      <CheckGroup>
        <legend>Meal Options</legend>
        <CheckAll>All options</CheckAll>
        <CheckList>
          <CheckItem value="pickles">Pickles</CheckItem>
          <CheckItem value="tomatoes">Tomatoes</CheckItem>
          <CheckItem value="lettuce">Lettuce</CheckItem>
          <CheckItem value="cheese">Cheese</CheckItem>
        </CheckList>
      </CheckGroup>
    </article>
  </section>
})