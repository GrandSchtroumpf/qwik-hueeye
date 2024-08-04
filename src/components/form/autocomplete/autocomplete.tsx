import { $, PropsOf, component$, sync$, useId, useStyles$ } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { WithControl, extractControls, useControlProvider } from "../control";
import { useFormFieldId } from "../form-field/form-field";
import { isServer } from "@builder.io/qwik/build";
import { usePopoverProvider } from "../../popover/popover";
import style from './autocomplete.scss?inline';
import { flipListbox } from "../listbox/listbox";

interface AutocompleteProps extends WithControl<string, PropsOf<'input'>> {
  datalist: string[];
}

export const Autocomplete = component$<AutocompleteProps>((props) => {
  useStyles$(style);
  const popoverId = useId();
  const { id: anchorId, hasFormField } = useFormFieldId(props.id);
  const { attr, controls } = extractControls(props);
  const { control, onChange, name } = useControlProvider(controls);
  const { datalist = [], ...inputProps } = (attr as PropsOf<'input'> & { datalist: string[] });
  const { trigger, popover } = usePopoverProvider({
    anchorId,
    popoverId,
  });
  const preventKeydown = sync$((e: KeyboardEvent, input: HTMLInputElement) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
    if (e.key === 'Enter') {
      if (input.hasAttribute('aria-activedescendant')) e.preventDefault();
    }
  });

  const setActive = $((input: HTMLInputElement, option?: Element) => {
    document.getElementById(popoverId)
      ?.querySelectorAll('[data-focus]')
      .forEach(option => option.removeAttribute('data-focus'));
    if (option) {
      input.setAttribute('aria-activedescendant', option.id);
      option.setAttribute('data-focus', '');
      option.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  });

  const toggle$ = $((value: string) => {
    if (isServer) return;
    const hasOneOption = datalist.some((option) => option.toLowerCase().includes(value));
    const popover = document.getElementById(popoverId);
    if (hasOneOption) popover?.showPopover();
    else popover?.hidePopover();
  });


  const onKeyDown$ = $((e: KeyboardEvent, input: HTMLInputElement) => {
    const popover = document.getElementById(popoverId);
    if (e.key === 'Enter') {
      const currentId = input.getAttribute('aria-activedescendant');
      if (!currentId) return;
      document.getElementById(currentId)?.click();
    }
    if (e.key === 'Escape') popover?.hidePopover();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      toggle$(input.value.toLowerCase());
      const options = popover?.querySelectorAll('[role="option"]:not([hidden])');
      if (!options) return;
      const currentId = input.getAttribute('aria-activedescendant');
      
      const index = Array.from(options).findIndex(option => option.id === currentId);
      let option: Element | undefined = undefined;
      if (e.key === 'ArrowDown') option = options?.item(index + 1);
      if (e.key === 'ArrowUp') {
        if (index === -1) option = options.item(options.length - 1);
        else option = options?.item(index - 1);
      }
      setActive(input, option);
    }
  });


  const select$ = $((value: string) => {
    onChange(value);
    const input = document.getElementById(anchorId) as HTMLInputElement;
    setActive(input);
    document.getElementById(popoverId)?.hidePopover();
  });

  const filter$ = $(async (e: Event, input: HTMLInputElement) => {
    const listbox = document.getElementById(popoverId);
    if (!listbox) return;
    flipListbox(listbox);
    const options = listbox.querySelectorAll('[role="option"]');
    const value = input.value.toLowerCase();
    for (const option of options) {
      const hasText = option.textContent?.toLowerCase().includes(value);
      if (hasText) {
        option.removeAttribute('hidden');
      } else {
        option.removeAttribute('data-focus');
        option.setAttribute('hidden', 'hidden');
        if (input.getAttribute('aria-activedescendant') === option.id) {
          input.removeAttribute('aria-activedescendant');
        }
      }
    }
    onChange(input.value);
  });

  const blur$ = $(() => {
    document.getElementById(popoverId)?.hidePopover();
  });

  const inputAttrs = mergeProps<'input'>(inputProps, trigger, {
    name: name?.toString(),
    class: 'he-input',
    onBlur$: blur$,
    onInput$: [filter$, $((e, input) => toggle$(input.value.toLowerCase()))],
    onKeyDown$: [preventKeydown, onKeyDown$],
    autocomplete: 'off',
    value: control.value,
    'aria-label': hasFormField ? undefined : (props['aria-label'] || props['placeholder']),
    'aria-autocomplete': 'list',
    'aria-controls': popoverId
  });

  const listboxAttrs: PropsOf<'ul'> = mergeProps<'ul'>(popover, {
    id: popoverId,
    class: "he-autocomplete-popover he-listbox",
    popover: 'manual',
    role: 'listbox',
  });

  return (
    <>
      <input {...inputAttrs} />
      <ul {...listboxAttrs}>
        {datalist.map((option) => (
          <li
            key={option}
            id={`${anchorId}-${option.split(' ').join('-')}`}
            role="option"
            class="he-autocomplete-option"
            onClick$={() => select$(option)}
            preventdefault:mousedown // Prevent blur to happen
          >
            {option}
          </li>
        ))}
      </ul>
    </>
  )
})
