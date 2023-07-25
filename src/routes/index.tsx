import { $, component$, event$, useSignal, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Slider } from "qwik-hueeye";
import styles from './index.scss?inline';

// type Movie = typeof MOVIES[number];

export default component$(() => {
  useStyles$(styles);
  const localTheme = useSignal<HTMLElement>();
  const random = event$(() => {
    const rand = Math.floor(Math.random() * 360);
    localTheme.value?.style.setProperty('--hue', `${rand}`);
  });

  const changeHue = $((event: any, input: HTMLInputElement) => {
    document.documentElement.style.setProperty('--hue', input.value);
  });
  const changeChroma = $((event: any, input: HTMLInputElement) => {
    document.documentElement.style.setProperty('--chroma', input.value);
  });

  return <section id="welcome-page" aria-labelledby="welcome-title">
    <h2 id="welcome-title">Welcome to my playground</h2>
    <article>
      <h3>Qwik & CSS</h3>
      <p>I created this app to play with qwik component and the new color spaces in CSS</p>
      <p>The goal was to create a pure CSS library to manage your theme</p>
      <p>You can change the global theme with the slide at the top</p>
    </article>
    <article ref={localTheme} class="theme">
      <h3>Local Theme</h3>
      <p>
        Everything works with CSS variables so takes advantage of classe scope.<br/>
        To create a local theme, add the class <code>theme</code> to the HTML element and set the <code>--hue</code> in the CSS.
      </p>
      <p>
        The trick is to use the <a href="https://oklch.com" target="_blank">oklch</a> space (lch would work too), and split into three variables (lightness, hue, chroma).
      </p>
      <footer>
        <button class="btn-fill primary" onClick$={random}>Shuffle Local Theme</button>
      </footer>
    </article>

    <article>
      <h3>Change theme</h3>
      {/* TODO: improve labelling */}
      <div class="theme-slider">
        <label>Hue: </label>
        <Slider name="hue" min="0" max="360" onChange$={changeHue}></Slider>
      </div>
      <div class="theme-slider">
        <label>Chroma: </label>
        <Slider name="chroma" min="0" max="0.1" step="0.01" onChange$={changeChroma}></Slider>
      </div>
    </article>

    <article>
      <h3>Light & Dark</h3>
      <p>
        The same hue will work on both light and dark. The light mode still requires some improvement though 😅.
      </p>
      <p>
        With the new <code>color-mix</code> css property we can manage states (hover, focus, ...) no matter the mode by applying an alpha layer.
      </p>
      <code class="block">
        background-color: color-mix(in oklch)
      </code>
    </article>
  </section>;
});

export const head: DocumentHead = () => {
  return {
    title: "Qwik Playground",
    meta: [
      {
        name: 'description',
        content: 'Playground to test qwik components and CSS new properties',
      }
    ],
  };
};