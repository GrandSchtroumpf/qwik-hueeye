# Qwik Hue Eye

A UI library for qwik with a strong focus on color management with native CSS variables.

⚠️ This is an **experimental** library with a TON of improvements to come.

See demo: https://qwik-playground.vercel.app/ 

```
npm i qwik-hueeye
```

Hue Eye comes with some global style with CSS variables. An easy way to import it is to use the `QwikCityProvider` in the `root.tsx` component.
`root.tsx`
```jsx
import { HueEyeProvider } from 'qwik-hueeye';

export default () => {
  return (
    ...
    <body>
      <HueEyeProvider> { /* <-- Add provider here */}
        <RouterOutlet />
        <ServiceWorkerRegister />
      </HueEyeProvider>
    </body>
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

- [button](src/components/button)
- [accordion](src/components/accordion)
- [dialog](src/components/dialog)
- [navlist](src/components/navlist)
- [form](src/components/form)


## ...More component later
Documentation takes time...
You can take a look at the list of component here : 
- [tabs](src/components/tabs/tabs.tsx)
- [toaster](src/components/toaster/toaster.tsx)
- [checkbox](src/components/form/checkbox/checkbox.tsx)
- [checklist](src/components/form/checkbox/checkgroup.tsx)
- [radio](src/components/form/radio/radio.tsx)
- [slider](src/components/form/slider/slider.tsx)
- [range](src/components/form/slider/range.tsx)
- [toggle](src/components/form/toggle/toggle.tsx)
- [switch](src/components/form/switch/switch.tsx)
- [form-field](src/components/form/form-field/form-field.tsx)
- [input](src/components/form/input/input.tsx)
- [select](src/components/form/select/select.tsx)