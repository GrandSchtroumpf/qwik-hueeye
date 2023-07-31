import { component$, Slot, useSignal, useStyles$ } from '@builder.io/qwik';
import { Slider, useHueEye } from 'qwik-hueeye';
import { NavLink, Navlist } from 'qwik-hueeye';
import { SvgGradient } from 'qwik-hueeye';
import { Toaster, useToasterProvider } from 'qwik-hueeye';
import { clsq } from 'qwik-hueeye';
import styles from './layout.scss?inline';

export default component$(() => {
  useStyles$(styles);
  useToasterProvider();
  const { hue } = useHueEye();
  const open = useSignal(false);

  return <>
    <div class={clsq('nav-overlay', open.value ? 'open' : 'close')} onClick$={() => open.value = false}>
      <Navlist aria-label="primary">
        <NavLink href="/">Theme</NavLink>
        <NavLink href="/form">Form</NavLink>
        <NavLink href="/select">Select</NavLink>
        <NavLink href="/checkbox">Checkbox</NavLink>
        <NavLink href="/radio">Radio</NavLink>
        <NavLink href="/switch">Switch</NavLink>
        <NavLink href="/toggle">Toggle</NavLink>
        <NavLink href="/accordion">Accordion</NavLink>
        <NavLink href="/tabs">Tabs</NavLink>
        <NavLink href="/button">Button</NavLink>
        <NavLink href="/dialog">Dialog</NavLink>
        <NavLink href="/tooltip">Tooltip</NavLink>
        <NavLink href="/toaster">Toaster</NavLink>
      </Navlist>
    </div>
    <header class="page-header">
      <button class="btn-icon sidenav-trigger" onClick$={() => open.value = true}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      <h1>Playground</h1>
      <label class="hue-slider">
        Hue
        <Slider bind:value={hue} position="end" min="0" max="360"></Slider>
      </label>
    </header>
    <main>
      <Slot />
    </main>
    <Toaster/>
    <SvgGradient/>
  </>;
});
