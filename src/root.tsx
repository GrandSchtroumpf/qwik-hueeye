import { HueEyeProvider } from "./components/hue/hue";
import './root.scss';

export default () => {

  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <HueEyeProvider>
        <header>
          <h1>HueEye</h1>
        </header>
        <main>
          <button class="btn-fill primary">Primary button</button>
          <button class="btn-icon gradient">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </button>
        </main>
        <footer>
          <p>This is a random footer</p>
        </footer>
        </HueEyeProvider>
      </body>
    </>
  );
};
