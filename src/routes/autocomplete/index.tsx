import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Label, FormField } from "qwik-hueeye-lib";
import { Autocomplete, HeAutocomplete } from "../../components/form/autocomplete";
import style from './index.scss?inline';

const options = ['Pickles', 'Tomatoes', 'Lettuce', 'Cheese'];

export default component$(() => {
  useStyles$(style);
  const selection = useSignal([]);
  return (
    <section id="select-page" aria-labelledby="select-title">
      <h1 id="select-title">Select</h1>
      <article>
        <h2>Prebuilt</h2>
        <HeAutocomplete datalist={options} />
      </article>
      <article>
        <h2>Select one option</h2>
        <FormField>
          <Label>Meal Options</Label>
          <Autocomplete.Root>
            <Autocomplete.Input/>
            <Autocomplete.Popover>
              <Autocomplete.Listbox>
                {options.map(option => (
                  <Autocomplete.Option key={option} value={option}>
                    {option}
                  </Autocomplete.Option>
                ))}
              </Autocomplete.Listbox>
            </Autocomplete.Popover>
          </Autocomplete.Root>
        </FormField>
      </article>
      <article>
        <h2>Select multiple options</h2>
        <FormField>
          <Label>Meal Options</Label>
          <Autocomplete.Root multi bind:value={selection}>
            <Autocomplete.SelectionList>
              {selection.value.map(item => (
                <Autocomplete.SelectionItem key={item}>
                  {item}
                </Autocomplete.SelectionItem>
              ))}
            </Autocomplete.SelectionList>
            <Autocomplete.Input/>
            <Autocomplete.Popover>
              <Autocomplete.Listbox>
                {options.map(option => (
                  <Autocomplete.Option key={option} value={option}>
                    {option}
                  </Autocomplete.Option>
                ))}
              </Autocomplete.Listbox>
            </Autocomplete.Popover>
          </Autocomplete.Root>
        </FormField>
      </article>
    </section>
  )
})