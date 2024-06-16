import { PropsOf, Slot, component$ } from "@builder.io/qwik";
import { ControlGroupProps, WithControlGroup, extractControls, useGroupControlProvider } from "./control";
import type { ControlGroup } from './types';

export const GroupFieldset = component$((props: WithControlGroup<ControlGroup, PropsOf<'fieldset'>>) => {
  useGroupControlProvider(props);
  const { attr, controls } = extractControls(props);
  return (
    <fieldset {...attr} name={controls.name?.toString()}>
      <Slot />
    </fieldset>
  );
});

export const GroupControl = component$((props: ControlGroupProps<ControlGroup>) => {
  useGroupControlProvider(props);
  return (
    <div role="group">
      <Slot />
    </div>
  );
});

export const GroupController = component$((props: ControlGroupProps<ControlGroup>) => {
  useGroupControlProvider(props);
  return <Slot />;
});