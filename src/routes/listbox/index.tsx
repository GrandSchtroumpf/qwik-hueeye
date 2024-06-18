import { component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import { ListBox, ListController, Option } from "qwik-hueeye-lib";
import style from './index.scss?inline';
import { Controller } from "../../components/form/controller";

const options: Record<string, string> = {
  pickles: 'Pickles',
  tomatoes: 'Tomatoes',
  lettuce: 'Lettuce',
  cheese: 'Cheese'
}

export default component$(() => {
  useStyles$(style);
  const singleOption = useSignal('');
  const multiOption = useStore<string[]>([]);
  return <section id="listbox-page" aria-labelledby="listbox-title">
    <h1 id="listbox-title">Select</h1>
    <article>
      <h2>Single option</h2>
      <Controller bind:value={singleOption}>
        <ListBox>
          {Object.entries(options).map(([key, text]) => (
            <Option key={key} value={key}>{text}</Option>
          ))}
        </ListBox>
      </Controller>
    </article>
    <article>
      <h2>Multiple options</h2>
      <ListController bind:value={multiOption}>
        <ListBox multi>
          {Object.entries(options).map(([key, text]) => (
            <Option key={key} value={key}>{text}</Option>
            ))}
        </ListBox>
      </ListController>
    </article>

  </section>
})