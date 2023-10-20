import { component$, Slot, useSignal, useStyles$ } from '@builder.io/qwik';
import { Slider, useHueEye } from 'qwik-hueeye';
import { LinkItem, NavList } from 'qwik-hueeye';
import { SvgGradient } from 'qwik-hueeye';
import { Toaster, useToasterProvider } from 'qwik-hueeye';
import { clsq } from 'qwik-hueeye';
import styles from './layout.scss?inline';
import { getAllIcons } from '../utils/material-icons';
import { server$ } from '@builder.io/qwik-city';
import { join } from 'path';
import { cwd } from 'process';

const query = server$(async function() {
  const folder = join(cwd(), 'src/components/icons/material');
  await getAllIcons(folder);

})

export default component$(() => {
  useStyles$(styles);
  useToasterProvider();
  const { hue } = useHueEye();
  const open = useSignal(false);
  query();

  return <>
    <div class={clsq('nav-overlay', open.value ? 'open' : 'close')} onClick$={() => open.value = false}>
      <NavList aria-label="primary">
        <LinkItem href="/">Theme</LinkItem>
        <LinkItem href="/form">Form</LinkItem>
        <LinkItem href="/input">Input</LinkItem>
        <LinkItem href="/select">Select</LinkItem>
        <LinkItem href="/checkbox">Checkbox</LinkItem>
        <LinkItem href="/radio">Radio</LinkItem>
        <LinkItem href="/switch">Switch</LinkItem>
        <LinkItem href="/toggle">Toggle</LinkItem>
        <LinkItem href="/slider">Slider</LinkItem>
        <LinkItem href="/accordion">Accordion</LinkItem>
        <LinkItem href="/menu">Menu</LinkItem>
        <LinkItem href="/tabs">Tabs</LinkItem>
        <LinkItem href="/button">Button</LinkItem>
        <LinkItem href="/dialog">Dialog</LinkItem>
        <LinkItem href="/tooltip">Tooltip</LinkItem>
        <LinkItem href="/toaster">Toaster</LinkItem>
        <LinkItem href="/gridlist">Grid List</LinkItem>
      </NavList>
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
