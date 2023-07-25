import { useStyles$ } from "@builder.io/qwik";
import type { QwikJSX} from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import styles from './index.scss?inline';

export const Icon = component$((props: QwikJSX.IntrinsicElements['svg']) => {
  return <svg viewBox="0 0 24 24" {...props}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
});

export default component$(() => {
  useStyles$(styles);
  return <section id="button-page" aria-labelledby="button-title">
    <h2 id="button-title">Buttons</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Basic</th>
          <th>Primary</th>
          <th>Secondary</th>
          <th>Warn</th>
          <th>Disabled</th>
          <th>Gradient</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>btn</th>
          <td>
            <button class="btn">Basic</button>
          </td>
          <td>
            <button class="btn primary">Primary</button>
          </td>
          <td>
            <button class="btn secondary">Secondary</button>
          </td>
          <td>
            <button class="btn warn">Warn</button>
          </td>
          <td>
            <button class="btn disabled">Diabled</button>
          </td>
          <td>
            <button class="btn gradient">Gradient</button>
          </td>
        </tr>
        <tr>
          <th>btn-fill</th>
          <td>
            <button class="btn-fill">Basic</button>
          </td>
          <td>
            <button class="btn-fill primary">Primary</button>
          </td>
          <td>
            <button class="btn-fill secondary">Secondary</button>
          </td>
          <td>
            <button class="btn-fill warn">Warn</button>
          </td>
          <td>
            <button class="btn-fill disabled">Diabled</button>
          </td>
          <td>
            <button class="btn-fill gradient">Gradient</button>
          </td>
        </tr>
        <tr>
          <th>btn-outline</th>
          <td>
            <button class="btn-outline">Basic</button>
          </td>
          <td>
            <button class="btn-outline primary">Primary</button>
          </td>
          <td>
            <button class="btn-outline secondary">Secondary</button>
          </td>
          <td>
            <button class="btn-outline warn">Warn</button>
          </td>
          <td>
            <button class="btn-outline disabled">Diabled</button>
          </td>
          <td>
            <button class="btn-outline gradient">Gradient</button>
          </td>
        </tr>
        <tr>
          <th>btn-icon</th>
          <td>
            <button class="btn-icon"><Icon/></button>
          </td>
          <td>
            <button class="btn-icon primary"><Icon/></button>
          </td>
          <td>
            <button class="btn-icon secondary"><Icon/></button>
          </td>
          <td>
            <button class="btn-icon warn"><Icon/></button>
          </td>
          <td>
            <button class="btn-icon disabled"><Icon/></button>
          </td>
          <td>
            <button class="btn-icon gradient"><Icon/></button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
})