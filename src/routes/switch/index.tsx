import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { SwitchGroup, Switch } from "qwik-hueeye-lib";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  const accept = useSignal(false);
  const meal = useStore({});
  return <section id="switch-page" aria-labelledby="switch-title">
    <h1 id="switch-title">Switch</h1>
    <article>
      <h2>Single Switch</h2>
      <Switch bind:value={accept}>Accept</Switch>
      <output>{accept.value ? '✅' : '❌'}</output>
    </article>
    <article>
      <h2>Select multiple options</h2>
      <SwitchGroup bind:value={meal}>
        <Switch name="pickles">Pickles</Switch>
        <Switch name="tomatoes">Tomatoes</Switch>
        <Switch name="lettuce">Lettuce</Switch>
        <Switch name="cheese">Cheese</Switch>
      </SwitchGroup>
      <output>{JSON.stringify(meal)}</output>
    </article>
  </section>
});
