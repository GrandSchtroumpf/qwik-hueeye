import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { Slider, Range, RangeStart, RangeEnd } from "qwik-hueeye-lib";
import style from './index.scss?inline';
import { NewRange, NewRangeEnd, NewRangeStart } from "../../components/form/slider/new-range";


export default component$(() => {
  useStyles$(style);
  const slider = useSignal(10);
  const range = useStore({ start: 10, end: 90 });
  return <section id="slider-page" aria-labelledby="slider-title">
    <h1 id="slider-title">Slider</h1>
    <article>
      <h2>Slider</h2>
      <Slider bind:value={slider} />
    </article>
    <article>
      <h2>Range</h2>
      <Range bind:value={range}>
        <RangeStart name="start"/>
        <RangeEnd name="end" />
      </Range>
    </article>
    <article>
      <h2>New Rang</h2>
      <NewRange bind:value={range}>
        <NewRangeStart name="start"/>
        <NewRangeEnd name="end" />
      </NewRange>
    </article>
  </section>
})