import { HueEyeProvider } from "./components/hue/hue";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';

import './root.scss';

export default () => {

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <HueEyeProvider>
          <RouterOutlet />
          <ServiceWorkerRegister />
        </HueEyeProvider>
      </body>
    </QwikCityProvider>
  );
};
