import { useId } from "@builder.io/qwik";

export function useWithId(id?: string) {
  const baseId = useId();
  return id ?? baseId;
}