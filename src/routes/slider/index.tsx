import { component$, useStyles$ } from "@builder.io/qwik";
import { Slider, ThumbStart, ThumbEnd, Range } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="slider-page" aria-labelledby="slider-title">
    <h1 id="slider-title">Slider</h1>
    <article>
      <h2>Slider</h2>
      <Slider onValueChange$={v => console.log(v)}/>
    </article>
    <article>
      <h2>Range</h2>
      <Range>
        <ThumbStart />
        <ThumbEnd />
      </Range>
    </article>

  </section>
})