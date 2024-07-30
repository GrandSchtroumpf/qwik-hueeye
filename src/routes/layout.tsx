import { component$, Slot, useSignal, useStyles$ } from "@builder.io/qwik";
import { AnchorItem, Form, MatIcon, Slider, useHueEye } from "qwik-hueeye-lib";
import { NavList } from "qwik-hueeye-lib";
import { SvgGradient } from "qwik-hueeye-lib";
import { Toaster, useToasterProvider } from "qwik-hueeye-lib";
import styles from "./layout.scss?inline";


export default component$(() => {
  useStyles$(styles);
  useToasterProvider();
  const state = useHueEye();
  const open = useSignal(false);
  return <>
    <div class={['nav-overlay', open.value ? 'open' : 'close']} onClick$={() => open.value = false}>
      <button class="close-btn">
        <MatIcon name="close" weight="500" />
      </button>
      <NavList aria-label="primary" vertical>
        <AnchorItem href="/">Theme</AnchorItem>
        <AnchorItem href="/form">Form</AnchorItem>
        <AnchorItem href="/search-form">Search Form</AnchorItem>
        <AnchorItem href="/autocomplete">Autocomplete</AnchorItem>
        <AnchorItem href="/input">Input</AnchorItem>
        <AnchorItem href="/select">Select</AnchorItem>
        <AnchorItem href="/combobox">Combobox</AnchorItem>
        <AnchorItem href="/checkbox">Checkbox</AnchorItem>
        <AnchorItem href="/radio">Radio</AnchorItem>
        <AnchorItem href="/switch">Switch</AnchorItem>
        <AnchorItem href="/toggle">Toggle</AnchorItem>
        <AnchorItem href="/slider">Slider</AnchorItem>
        <AnchorItem href="/accordion">Accordion</AnchorItem>
        <AnchorItem href="/menu">Menu</AnchorItem>
        <AnchorItem href="/tabs">Tabs</AnchorItem>
        <AnchorItem href="/button">Button</AnchorItem>
        <AnchorItem href="/dialog">Dialog</AnchorItem>
        <AnchorItem href="/icons">Icons</AnchorItem>
        <AnchorItem href="/tooltip">Tooltip</AnchorItem>
        <AnchorItem href="/toaster">Toaster</AnchorItem>
        <AnchorItem href="/gridlist">Grid List</AnchorItem>
        <AnchorItem href="/listbox">Listbox</AnchorItem>
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
        <label class="hue-controller">
          Hue
          <Slider class="hue-slider" name="hue" min={0} max={360}></Slider>
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
