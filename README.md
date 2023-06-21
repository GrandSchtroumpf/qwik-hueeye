# Qwik Hue Eye

A UI library for qwik with a strong focus on color management with native CSS variables.
⚠️ This is an **experimental** library with a TON of improvements to come.

```
npm i qwik-hueeye
```

Hue Eye comes with some global style with CSS variables. An easy way to import it is to use the `QwikCityProvider` in the `root.tsx` component.
`root.tsx`
```jsx
import { HueEyeProvider } from 'qwik-hueeye';

export default () => {
  return (
  <QwikCityProvider>
    <HueEyeProvider>
      {/* head & body here */}
    </HueEyeProvider>
  </QwikCityProvider>
  );
};
```

## CSS variables
The goal of this lib is to be customizable with css variables.

### Hue (required)
First set the hue you can to use for your application
```css
html {
  --hue: 250; /* Blue color */
}
```
The whole theme will adapt based o nthis css variable.

demo: https://qwik-playground.vercel.app/ 

## Components

### btn
As btn are style only we can use it class CSS classes.
Here are some example of implementation
```jsx
export default component$(() => {
  return <>
    <button class="btn">basic button</button>
    <button class="btn-outline primary">outline button with primary color</button>
    <a class="btn-fill secondary">Fill anchor with primary color</a>
    <Link class="btn-icon warn">
      <svg>{/* Some warning icon */}</svg>
    </Link>
  </>
})
```
Currently the `btn-*` classes are included in the global style. It'll surely move into it's own context later.

You can also apply gradient on your btn: 
```jsx
export default component$(() => {
  return <>
    <button class="btn gradient">gradient btn</button>
    <button class="btn-outline gradient">gradient outline btn</button>
    <button class="btn-fill gradient">gradient fill btn</button>
    <button class="btn-icon gradient">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </button>
  </>
})
```

## ...More component later
Documentation takes time...
You can take a look at the list of component here : 
- [accordion](src/components/accordion/accordion.tsx)
- [navlist](src/components/navlist/navlist.tsx)
- [tabs](src/components/tabs/tabs.tsx)
- [toaster](src/components/toaster/toaster.tsx)