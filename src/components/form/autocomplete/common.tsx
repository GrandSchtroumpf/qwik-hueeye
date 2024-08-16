import { $, CorrectedToggleEvent, JSXChildren, PropsOf, Slot, component$, createContextId, sync$, useComputed$, useContext, useContextProvider } from "@builder.io/qwik";
import { mergeProps } from "../../utils/attributes";
import { findNode } from "../../utils/jsx";
import { useWithId } from "../../hooks/useWithId";
import { WithControl, extractControls, useControl, useControlProvider } from "../control";
import { comboboxNavigation, filterCombobox } from "../combobox/base";

interface AutocompleteCxt {
  multi: boolean;
  popoverId: string;
  inputId: string;
}

const AutocompleteContext = createContextId<AutocompleteCxt>('AutocompleteContext');

interface RootProps extends PropsOf<'div'>, Partial<AutocompleteCxt> {}
export const RootImpl = component$<WithControl<string | string[], RootProps>>((props) => {
  const { controls, attr } = extractControls(props);
  const { multi, popoverId, inputId, ...rest } = attr;
  useControlProvider(controls, multi ? [] : '');
  useContextProvider(AutocompleteContext, {
    multi: !!multi,
    popoverId: useWithId(popoverId),
    inputId: useWithId(inputId),
  });
  const attributes = mergeProps<'div'>(rest, {
    class: 'he-autocomplete-root'
  });
  return <div {...attributes}>
    <Slot />
  </div>
});

export const SelectionList = component$<PropsOf<'ul'>>((props) => {
  const { multi } = useContext(AutocompleteContext);
  if (!multi) return <></>;
  const attributes = mergeProps<'ul'>(props, {
    class: 'he-autocomplete-selection-list',
  });
  return <ul {...attributes}>
    <Slot />
  </ul>
});

export const SelectionItem = component$<PropsOf<'li'>>((props) => {
  const attributes = mergeProps<'li'>(props, {
    class: 'he-autocomplete-selection-item',
  });
  return <li {...attributes}>
    <Slot />
  </li>
});


export const Popover = component$<PropsOf<'div'>>((props) => {
  const { inputId, popoverId } = useContext(AutocompleteContext);
  const toggle = $((e: CorrectedToggleEvent, el: HTMLElement) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;
    if (e.newState !== 'open') {
      queueMicrotask(() => input?.focus());
      input.removeAttribute('aria-activedescendant');
      const options = el.querySelectorAll<HTMLElement>('[role="option"]');
      for (const option of options) {
        option.removeAttribute('data-focus');
        option.removeAttribute('hidden');
      }
    }
  });

  const attributes = mergeProps<'div'>(props, {
    id: popoverId,
    class: 'he-autocomplete-popover',
    popover: 'auto',
    onToggle$: toggle
  });
  return <div {...attributes}>
    <Slot />
  </div>;
});


export const Input = component$<PropsOf<'input'>>((props) => {
  const { multi, inputId, popoverId } = useContext(AutocompleteContext);
  const { control } = useControl<string>();

  const onKeyDown = $((e: KeyboardEvent, input: HTMLElement) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      document.getElementById(popoverId)?.showPopover();
    }
    comboboxNavigation(e, input);
    if (e.key === 'Enter') {
      const activeId = input.getAttribute('aria-activedescendant');
      if (activeId) document.getElementById(activeId)?.click();
    }
  })

  const preventKeydown = sync$((e: KeyboardEvent, input: HTMLInputElement) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault();
    if (e.key === 'Enter') {
      if (input.hasAttribute('aria-activedescendant')) e.preventDefault();
    }
  });

  const filter = $(async (e: InputEvent, input: HTMLInputElement) => {
    const { empty } = await filterCombobox(e, input);
    const popover = document.getElementById(popoverId)!;
    empty ? popover.hidePopover() : popover.showPopover();
  })


  const blur = $(() => {
    document.getElementById(popoverId)?.hidePopover();
  });

  const attributes = mergeProps<'input'>(props, {
    id: inputId,
    class: 'he-autocomplete-input',
    onBlur$: blur,
    onInput$: filter,
    onKeyDown$: [preventKeydown, onKeyDown],
    autocomplete: 'off',
    'aria-autocomplete': 'list',
    'aria-controls': popoverId
  });
  if (!multi) attributes.value = control.value;
  return <input {...attributes} />
})

export const Listbox = component$<PropsOf<'ul'>>((props) => {
  const { multi } = useContext(AutocompleteContext);
  const attributes = mergeProps<'ul'>(props, {
    class: 'he-autocomplete-listbox',
    role: 'listbox',
    "aria-multiselectable": multi,
  })
  return <ul {...attributes}>
    <Slot />
  </ul>
});




interface OptionProps extends PropsOf<'li'> {
  value?: string;
}
const addItem = $(function<T>(list: T[], item: T): T[] {
  return [...list, item];
});
const removeItem = $(function<T>(list: T[], item: T) {
  const index = list.indexOf(item);
  return [...list.splice(0, index), ...list.splice(index + 1)];
})
const toggleItem = $(function<T>(list: T[], item: T) {
  if (list.includes(item)) {
    return removeItem(list, item);
  } else {
    return addItem(list, item);
  }
})
export const Option = component$<OptionProps>((props) => {
  const { value, ...rest } = props;
  const { multi } = useContext(AutocompleteContext);
  const { control, change } = useControl();
  const selected = useComputed$(() => {
    if (multi) {
      return (control.value as string[]).includes(value ?? '');
    } else {
      return control.value === value;
    }
  });
  const select = $(async () => {
    if (multi) {
      const updated = await toggleItem(control.value as string[], value);
      change(updated as string[]);
    } else {
      change(selected.value ? undefined : value);
    }
  });
  const attributes = mergeProps<'li'>(rest, {
    class: 'he-autocomplete-option',
    role: 'option',
    'aria-selected': !multi && selected.value,
    'aria-checked': multi && selected.value,
    onClick$: select,
    'preventdefault:mousedown': true,
  });
  return <li {...attributes}>
    <Slot />
  </li>
});


type RootFnProps = Omit<RootProps & { children: JSXChildren }, 'popoverId' | 'inputId'>;
export const Root = (props: WithControl<string | string[], RootFnProps>) => {
  const { children, ...baseRootProps } = props;
  const inputId = findNode(children, Input)?.props.id;
  const popoverId = findNode(children, Popover)?.props.id;
  const rootProps = { ...baseRootProps, inputId, popoverId };
  return <RootImpl {...rootProps}>{children}</RootImpl>;
}
