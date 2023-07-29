import { component$, useStyles$ } from "@builder.io/qwik";
import { Select, Label, FormField, Option } from "qwik-hueeye";
import style from './index.scss?inline';


export default component$(() => {
  useStyles$(style);
  return <section id="select-page" aria-labelledby="select-title">
    <h1 id="select-title">Select</h1>
    <article>
      <h2>Select one option</h2>
      <FormField>
        <Label>Meal Options</Label> 
        <Select placeholder="Options">
          <Option value="">-- Select an Option --</Option>
          <Option value="pickles">Pickles</Option>
          <Option value="tomatoes">Tomatoes</Option>
          <Option value="lettuce">Lettuce</Option>
          <Option value="cheese">Cheese</Option>
        </Select>
      </FormField>
    </article>
    <article>
      <h2>Multiple options</h2>
      <FormField class="fill">
        <Label>Meal Options</Label> 
        <Select placeholder="Options" multi>
          <Option value="pickles">Pickles</Option>
          <Option value="tomatoes">Tomatoes</Option>
          <Option value="lettuce">Lettuce</Option>
          <Option value="cheese">Cheese</Option>
        </Select>
      </FormField>
    </article>

  </section>
})