import { createContextId, useStyles$ } from "@builder.io/qwik";
import styles from './hue.scss?inline';

export const HueEyeContext = createContextId('HueEyeContext');

export const useHueEyeProvider = () => {
  useStyles$(styles);
}
