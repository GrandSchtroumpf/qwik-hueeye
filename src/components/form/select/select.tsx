import { component$, Slot, useStyles$, useSignal, event$, useId, useContextProvider, createContextId, useContext, $, useTask$, useComputed$ } from "@builder.io/qwik";
import type { QRL, Signal, FunctionComponent, JSXNode, JSXChildren } from "@builder.io/qwik";
import { Popover } from "../../dialog/popover";
import { useNameId } from "../field";
import type { LiAttributes } from "../types";
import { FormFieldContext } from "../form-field/form-field";
import { focusNextInput, focusPreviousInput, useKeyboard } from "../../utils";
import { ControlValueProps, useControlValue, useControllerProvider } from "../control";
import styles from './select.scss?inline';



interface BaseSelectProps<T = any> extends ControlValueProps<T> {
  multi: boolean;
  placeholder?: string;
  /** 
   * Method used to customize how selected options are displayed
   */
  display$: QRL<(value: T) => string | undefined>;
}

interface SelectProps<T = any> extends Omit<BaseSelectProps<T>, 'multi' | 'display$'> {
  children: JSXChildren;
  display$?: QRL<(value: T) => string | undefined>;
}

export interface SelectionItemProps extends LiAttributes {
  value?: string;
  mode?: 'radio' | 'toggle';
}


const SelectContext = createContextId<{
  opened: Signal<boolean>,
  multi: boolean,
  name: string,
}>('SelectContext');

const disabledKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'ctrl+a'];

/** Get the textcontent of the option */
const getNodeText = (node: JSXNode | string | number): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (node instanceof Array) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node) return getNodeText(node.props.children);
  return '';
}

/** Extract the options from the children of the select */
const getOptions = (node: JSXChildren) => {
  const options: Record<string, string> = {};
  if (node instanceof Array) {
    for (const child of node) Object.assign(options, getOptions(child));
  } else if (typeof node === 'object' && node) {
    if ('type' in node && node.type === Option && node.props.value) {
      options[node.props.value] = getNodeText(node);
    }
    if ('props' in node && node.props.children === 'object' && node.props.children) {
      Object.assign(options, getOptions(node.props.children));
    }
  }
  return options;
}

const displayMultiNodeContent = (children: JSXChildren) => {
  const options = getOptions(children);
  return $((values: string[]) => values.map(value => options[value]).join(', '));
}

export const MultiSelect: FunctionComponent<Omit<SelectProps<string[]>, 'multi'>> = ({children, ...props}) => {
  const display$ = props.display$ ?? displayMultiNodeContent(children);
  return <BaseSelect multi {...props} display$={display$}>
    {children}
  </BaseSelect>;
}

const displaySingleNodeContent = (children: JSXChildren) => {
  const options = getOptions(children);
  return $((value: string) => options[value]);
}

export const Select: FunctionComponent<Omit<SelectProps<string>, 'multi'>> = ({children, ...props}) => {
  const display$ = props.display$ ?? displaySingleNodeContent(children);
  return <BaseSelect multi={false} {...props} display$={display$}>
    {children}
  </BaseSelect>;
}


export const BaseSelect = component$((props: BaseSelectProps) => {
  useStyles$(styles);
  const { id } = useContext(FormFieldContext);
  const origin = useSignal<HTMLElement>();
  const opened = useSignal(false);
  const multi = props.multi;
  const displayDefault = useSignal('');
  const name = useNameId(props);
  const popoverId = useId();
  
  const onClick$ = event$(() => {
    if (opened.value && !multi) opened.value = false;
    if (!opened.value) opened.value = true;
  });

  const toggleAll = event$(() => {
    const checkboxes = origin.value?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    if (!checkboxes) return;
    if (bindValue.value?.length === checkboxes.length) return bindValue.value = [];
    bindValue.value = Array.from(checkboxes).filter(c => !!c.value).map(c => c.value);
  });
 
  const { bindValue } = useControllerProvider<string | string[]>(props, multi ? [] : '');
  
  // Customer display function
  const displayText = useComputed$(() => props.display$(bindValue.value));
  const display = useComputed$(() => displayText.value ?? displayDefault.value);
  const displayClass = useComputed$(() => display.value ? 'value' : 'placeholder');
  
  useTask$(({ track }) => {
    track(() => opened.value);
    if (!opened.value) return;
    const active = origin.value?.querySelector<HTMLElement>('input:checked');
    // Wait for dialog to open
    if (active) requestAnimationFrame(() => active.focus()) ;
  });

  useKeyboard(origin, disabledKeys, $((event, el) => {
    const key = event.key;
    if (!opened.value) {
      if (disabledKeys.includes(key)) opened.value = true;
    } else {
      if (key === 'ArrowLeft' || key === 'ArrowUp') focusPreviousInput(el);
      if (key === 'ArrowRight' || key === 'ArrowDown') focusNextInput(el);
      if (key === 'Tab') opened.value = false;
      if (key === 'Enter' || key === ' ') {
        if (event.target instanceof HTMLInputElement) event.target.click();
        if (!multi) opened.value = false;
      }
      if (event.ctrlKey && key === 'a' && multi) toggleAll();
    }
  }));


  useContextProvider(SelectContext, {
    name,
    multi,
    opened,
  });


  return <>
    <div class="field select" ref={origin}
      onClick$={(e, el) => e.target === el ? onClick$() : null}
      onBlur$={() => opened.value = false}
      >
      <Slot name="prefix"/>
      <button type="button" id={id}
        role="combobox"
        aria-haspopup="listbox" 
        aria-disabled="false"
        aria-invalid="false"
        aria-autocomplete="none"
        aria-expanded={opened.value}
        aria-controls={popoverId}
        aria-labelledby={'label-' + id}
        onClick$={onClick$}
      >
        <span class={displayClass.value}>
          {display.value || props.placeholder}
        </span>
        <svg viewBox="7 10 10 5" class={opened.value ? 'opened' : 'closed'} aria-hidden="true" focusable="false">
          <polygon stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10"></polygon>
        </svg>
      </button>
      <Slot name="suffix"/>
      <Popover origin={origin} open={opened} position="block" id={popoverId}>
        <div class="listbox" role="listbox" aria-labelledby={'label-' + id} aria-multiselectable={multi}>
          <Slot />
        </div>
      </Popover>
    </div>
  </>
});


interface OptionGroupProps {
  label: string;
  diabled?: boolean;
}
export const OptionGroup = component$(({ label }: OptionGroupProps) => {
  useStyles$(styles);
  return <li>
    <ul role="group">
      <h4>{label}</h4>
      <Slot/>
    </ul>
  </li>
})


const SingleOption = component$((props: SelectionItemProps) => {
  const value = props.value ?? '';
  const { opened, name } = useContext(SelectContext);
  const id = useId();
  const {bindValue} = useControlValue<string>();
  const checked = useComputed$(() => !!value && bindValue.value === value);
  const toggle = $(() => {
    opened.value = false;
    bindValue.value = checked.value ? '' : value;
  });
  return <div class="option">
    <input id={id} type="radio" name={name} checked={checked.value} value={value} onClick$={toggle}/>
    <label for={id} class={props.class}>
      <Slot/>
    </label>
  </div>
});

const MultiOption = component$((props: SelectionItemProps) => {
  const value = props.value ?? '';
  const id = useId();
  const { name } = useContext(SelectContext);
  const {bindValue} = useControlValue<string[]>();
  const checked = useComputed$(() => !!value && bindValue.value.includes(value));
  const toggle = $(() => {
    bindValue.value = checked.value
      ? bindValue.value.filter(v => v !== value)
      : bindValue.value.concat(value);
  });
  return <div class="option">
    <input id={id} type="checkbox" name={name} checked={checked.value} value={value} onClick$={toggle}/>
    <label for={id} class={props.class}>
      <Slot/>
    </label>
  </div>
})

export const Option = component$((props: SelectionItemProps) => {
  const { multi } = useContext(SelectContext);
  if (multi) {
    return <MultiOption {...props}>
      <Slot/>
    </MultiOption>
  } else {
    return <SingleOption {...props}>
      <Slot/>
    </SingleOption>
  }  
});