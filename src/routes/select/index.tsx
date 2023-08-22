import { component$, useStyles$ } from "@builder.io/qwik";
import { Select, Label, FormField, Option, MultiSelect } from "qwik-hueeye";
import style from './index.scss?inline';

const options: Record<string, string> = {
  pickles: 'Pickles',
  tomatoes: 'Tomatoes',
  lettuce: 'Lettuce',
  cheese: 'Cheese'
}

export default component$(() => {
  useStyles$(style);
  return <section id="select-page" aria-labelledby="select-title">
    <h1 id="select-title">Select</h1>
    <article>
      <h2>Select one option</h2>
      <FormField>
        <Label>Meal Options</Label> 
        <Select placeholder="Options" value="pickles">
          <Option>-- Select an Option --</Option>
          {Object.entries(options).map(([key, text]) => (
            <Option key={key} value={key}>{text}</Option>
          ))}
        </Select>
      </FormField>
    </article>
    <article>
      <h2>Multiple options</h2>
      <FormField class="fill">
        <Label>Meal Options</Label> 
        <MultiSelect placeholder="Options" value={['pickles', 'cheese']}>
          {Object.entries(options).map(([key, text]) => (
            <Option key={key} value={key}>{text}</Option>
          ))}
        </MultiSelect>
      </FormField>
    </article>

  </section>
})