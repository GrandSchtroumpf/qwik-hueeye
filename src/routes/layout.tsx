import { component$, Slot, useSignal, useStyles$ } from '@builder.io/qwik';
import { Form, Slider, useHueEye } from 'qwik-hueeye';
import { LinkItem, NavList } from 'qwik-hueeye';
import { SvgGradient } from 'qwik-hueeye';
import { Toaster, useToasterProvider } from 'qwik-hueeye';
import styles from './layout.scss?inline';


export default component$(() => {
  useStyles$(styles);
  useToasterProvider();
  const state = useHueEye();
  const open = useSignal(false);
  return <>
    <div class={['nav-overlay', open.value ? 'open' : 'close']} onClick$={() => open.value = false}>
      <NavList aria-label="primary" vertical>
        <LinkItem href="/">Theme</LinkItem>
        <LinkItem href="/form">Form</LinkItem>
        <LinkItem href="/search-form">Search Form</LinkItem>
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
        <LinkItem href="/icons">Icons</LinkItem>
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
      <Form bind:value={state}>
        <label class="hue-slider">
          Hue
          <Slider name="hue" position="end" min="0" max="360"></Slider>
        </label>
      </Form>
    </header>
    <main>
      <Slot />
    </main>
    <Toaster/>
    <SvgGradient/>
  </>;
});
