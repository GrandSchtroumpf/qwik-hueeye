import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { useHueEyeProvider } from "./components/hue/hue";


export const HueProvider = component$(() => {
  useHueEyeProvider();
  useStyles$(`
    html {
      --hue: 0;
    }
    body {
      display: flex;
      flex-direction: column;
      gap: var(--size-2);
      padding: var(--size-2);
      box-sizing: border-box;
    }
    header, footer {
      background-color: var(--surface-low);
    }
    main {
      background-color: var(--surface);
      flex: 1;
      padding: var(--size-2);
      box-sizing: border-box;
    }
  `);
  return <Slot/>;
})

export default () => {

  return (
    <HueProvider>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <header>
          <h1>HueEye</h1>
        </header>
        <main>
          <button class="btn-fill primary">Primary button</button>
        </main>
        <footer>
          <p>This is a random footer</p>
        </footer>
      </body>
    </HueProvider>
  );
};
