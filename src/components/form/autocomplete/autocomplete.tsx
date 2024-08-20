import { PropsOf, component$, useStyles$ } from "@builder.io/qwik";
import { WithControl, extractControls } from "../control";
import * as Autocomplete from "./common";
import style from './autocomplete.scss?inline';

interface AutocompleteProps extends WithControl<string, PropsOf<'input'>> {
  datalist: string[];
}

export const HeAutocomplete = component$<WithControl<string, AutocompleteProps>>((props) => {
  useStyles$(style);
  const { attr, controls } = extractControls(props);
  const { datalist, ...inputProps } = attr;
  return (
    <Autocomplete.Root class={attr.class}>
      <Autocomplete.Input {...inputProps} {...controls} name={controls.name?.toString()} />
      <Autocomplete.Panel>
        <Autocomplete.Listbox>
          {datalist.map(option => (
            <Autocomplete.Option key={option} value={option}>
              {option}
            </Autocomplete.Option>
          ))}
        </Autocomplete.Listbox>
      </Autocomplete.Panel>
    </Autocomplete.Root>
  )
});

export const HeMultiAutocomplete = component$<WithControl<string[], AutocompleteProps>>((props) => {
  useStyles$(style);
  const { attr, controls } = extractControls(props);
  const { datalist, ...inputProps } = attr;
  return (
    <Autocomplete.Root class={attr.class}>
      <Autocomplete.Input />
      <Autocomplete.Panel>
        <Autocomplete.Listbox>
          {datalist.map(option => (
            <Autocomplete.Option key={option} value={option}>
              {option}
            </Autocomplete.Option>
          ))}
        </Autocomplete.Listbox>
      </Autocomplete.Panel>
    </Autocomplete.Root>
  )
});
