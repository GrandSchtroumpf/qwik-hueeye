import { component$, useStyles$ } from "@builder.io/qwik";
import { Label, FormField } from "qwik-hueeye-lib";
import style from './index.scss?inline';
import { Autocomplete } from "../../components/form/autocomplete/autocomplete";

const options = ['Pickles', 'Tomatoes', 'Lettuce', 'Cheese'];

export default component$(() => {
  useStyles$(style);
  return <section id="select-page" aria-labelledby="select-title">
    <h1 id="select-title">Select</h1>
    <article>
      <h2>Select one option</h2>
      <FormField>
        <Label>Meal Options</Label> 
        <Autocomplete class="outline" placeholder="Options" value="Pickles" datalist={options} />
      </FormField>
    </article>
  </section>
})