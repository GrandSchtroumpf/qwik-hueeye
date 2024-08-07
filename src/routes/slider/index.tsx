import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { Slider, Range, RangeStart, RangeEnd, RangeTickList } from "qwik-hueeye-lib";
import style from './index.scss?inline';


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
      <Range bind:value={range} step={5}>
        <RangeStart name="start"/>
        <RangeEnd name="end" />
        <RangeTickList />
      </Range>
    </article>
    <article>
      <h2>Range Vertical</h2>
      <Range class="vertical" bind:value={range} vertical>
        <RangeStart name="start"/>
        <RangeEnd name="end" />
      </Range>
    </article>
  </section>
})