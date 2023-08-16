import { component$, useStyles$ } from "@builder.io/qwik";
import { Slider, Range } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="slider-page" aria-labelledby="slider-title">
    <h1 id="slider-title">Slider</h1>
    <article>
      <h2>Slider</h2>
      <Slider value={10} onValueChange$={v => console.log(v)}/>
    </article>
    <article>
      <h2>Range</h2>
      <Range startName="from" endName="to" value={{ from: 10, to: 90 }} />
    </article>
  </section>
})