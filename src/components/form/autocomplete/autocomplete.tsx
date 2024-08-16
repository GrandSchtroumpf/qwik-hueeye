import { PropsOf, component$, useStyles$ } from "@builder.io/qwik";
import { WithControl } from "../control";
import style from './autocomplete.scss?inline';
import * as Autocomplete from "./common";

interface AutocompleteProps extends WithControl<string, PropsOf<'input'>> {
  datalist: string[];
}

export const HeAutocomplete = component$<WithControl<string, AutocompleteProps>>((props) => {
  useStyles$(style);
  return (
    <Autocomplete.Root>
      <Autocomplete.Input/>
      <Autocomplete.Popover>
        <Autocomplete.Listbox>
          {props.datalist.map(option => (
            <Autocomplete.Option key={option} value={option}>
              {option}
            </Autocomplete.Option>
          ))}
        </Autocomplete.Listbox>
      </Autocomplete.Popover>
    </Autocomplete.Root>
  )
});

export const HeMultiAutocomplete = component$<WithControl<string[], AutocompleteProps>>((props) => {
  useStyles$(style);
  return (
    <Autocomplete.Root>
      <Autocomplete.Input/>
      <Autocomplete.Popover>
        <Autocomplete.Listbox>
          {props.datalist.map(option => (
            <Autocomplete.Option key={option} value={option}>
              {option}
            </Autocomplete.Option>
          ))}
        </Autocomplete.Listbox>
      </Autocomplete.Popover>
    </Autocomplete.Root>
  )
});
