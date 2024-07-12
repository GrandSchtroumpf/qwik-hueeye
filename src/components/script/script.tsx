import { PropsOf } from "@builder.io/qwik";

interface Props extends PropsOf<'script'> {
  children: string | Function;
  type?: 'speculationrules' | 'importmap' | 'module'
}
export const Script = (props: Props) => {
  const { children, ...attr } = props;
  const content = typeof children === 'function'
    ? `(${children.toString()})()`
    : children;
  return <script {...attr} dangerouslySetInnerHTML={content} />
}
