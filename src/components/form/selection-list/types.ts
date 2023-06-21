import type { LiAttributes } from "../types";

export interface SelectionItemProps extends LiAttributes {
  value?: string;
  mode?: 'radio' | 'toggle';
}