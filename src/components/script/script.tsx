import { PropsOf } from "@builder.io/qwik";

interface Props extends PropsOf<'script'> {
  children: string | Function;
  type?: 'speculationrules' | 'importmap' | 'module';
  params?: any[];
}
export const Script = (props: Props) => {
  const { children, params = [], ...attr } = props;
  const content = typeof children === 'function'
    ? `(${children.toString()})(${params.map((v) => JSON.stringify(v)).join(',')})`
    : children;
  return <script {...attr} dangerouslySetInnerHTML={content} />
}
