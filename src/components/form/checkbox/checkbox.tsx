import { component$, createContextId, FunctionComponent, JSXNode, Slot, useComputed$, useContext, useContextProvider, useId, useSignal, useTask$ } from "@builder.io/qwik";
import { FieldGroupContext, useGroupName } from "../field";
import type { FieldsetAttributes, InputAttributes } from "../../types";
import { ControlValueProps, extractControlProps, useControlItemProvider, useControlList, useControlListProvider, useControlValue } from "../control";
import { mergeProps } from "../../utils/attributes";
import styles from './checkbox.module.scss';

export interface CheckListProps extends Omit<FieldsetAttributes, 'role' | 'tabIndex' | 'onKeyDown$'>, ControlValueProps<string[]> {}

export const CheckList: FunctionComponent<CheckListProps> = ({children, ...props}) => {
  const allValues = (children as JSXNode[]).filter(node => !!node.props.value).map(node => node.props.value);
  return <CheckListImpl allValues={allValues} {...props} >
    {children}
  </CheckListImpl>
}


interface CheckListImplProps extends CheckListProps {
  allValues: string[];
}
const CheckListContext = createContextId<string[]>('CheckListContext');
export const CheckListImpl = component$((props: CheckListImplProps) => {
  const { rootRef, onValueChange } = useControlListProvider(props);
  const attr = extractControlProps(props);
  
  useContextProvider(CheckListContext, props.allValues);
  useContextProvider(FieldGroupContext, { name: props.name });
  const mergeAttr = mergeProps({ class: styles.checkList, onChange$: onValueChange }, attr);

  return <fieldset ref={rootRef} {...mergeAttr} >
    <Slot />
  </fieldset>
})


export const CheckAll = component$(() => {
  const checkAllRef = useSignal<HTMLInputElement>();
  const { rootRef, bindValue, toggleAll } = useControlList<string>();
  const allValues = useContext(CheckListContext);
  const classes = useSignal('');
  // If there is an initialValue, verify the mode of the checkAll element
  useTask$(({ track }) => {
    const change = track(() => bindValue.value);
    const allChecked = change?.length === allValues.length;
    const isIndeterminate = !!change?.length && !allChecked;
    classes.value = isIndeterminate ? styles.indeterminate : '';
    if (checkAllRef.value && rootRef.value) {
      if (!change?.length) {
        checkAllRef.value.indeterminate = false;
        checkAllRef.value.checked = false;
      } else {
        checkAllRef.value.indeterminate = isIndeterminate;
        checkAllRef.value.checked = !isIndeterminate;
      }
    }
  });

  return <InnerCheckbox ref={checkAllRef} class={classes.value} onClick$={toggleAll} preventdefault:click>
    <Slot/>
  </InnerCheckbox>
})

interface CheckItemProps extends Omit<InputAttributes, 'type' | 'children'>{
  value: string;
}

export const CheckItem = component$((props: CheckItemProps) => {
  const name = useGroupName(props);
  const value = props.value;
  const {bindValue} = useControlValue<string[]>();
  const checked = useComputed$(() => !!value && bindValue.value.includes(value));

  return <InnerCheckbox {...props} name={name} checked={checked.value}>
    <Slot/>
  </InnerCheckbox>
})


interface CheckboxProps extends Omit<InnerCheckboxProps, 'value'|'bind:value'>, ControlValueProps<boolean> {}

export const Checkbox = component$((props: CheckboxProps) => {
  const {onValueChange} = useControlItemProvider<boolean>(props, !!props.checked);
  const attr = extractControlProps(props);
  return <InnerCheckbox {...attr} onChange$={(e, i) => onValueChange(i.checked)} >
    <Slot/>
  </InnerCheckbox>
})


interface InnerCheckboxProps extends Omit<InputAttributes, 'type' | 'children'> {}

const InnerCheckbox = component$((props: InnerCheckboxProps) => {
  const baseId = useId();
  const id = props.id ?? baseId;

  return <div class={styles.checkbox}>
    <input {...props} id={id} type="checkbox"/>
    <label for={id}>
      <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none"></path>
      </svg>
      <Slot/>
    </label>
  </div>
})
