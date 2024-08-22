import {
  PropsOf,
  Slot,
  component$,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import { Link, LinkProps, useLocation } from "@builder.io/qwik-city";
import { isSamePathname } from "../utils";
import { mergeProps } from "../../utils/attributes";
import {
  Eagerness,
  useSpeculativeRules,
} from "../../hue/speculative-rules-provider";
import style from "./item.scss?inline";

export const LinkItem = component$((props: LinkProps) => {
  useStyles$(style);
  const { url } = useLocation();
  const href = props.href;
  const attributes = mergeProps<"a">(props, {
    class: "he-item he-item-link",
    "aria-current": isSamePathname(url.pathname, href) ? "page" : (null as any),
  });
  return (
    <Link {...attributes}>
      <Slot />
    </Link>
  );
});

interface AnchorItemProps extends PropsOf<"a"> {
  rule?: "none" | "prefetch" | "prerender";
  eagerness?: Eagerness;
}
export const AnchorItem = component$<AnchorItemProps>((props) => {
  useStyles$(style);
  const rules = useSpeculativeRules();
  const { url } = useLocation();
  const { rule, eagerness, ...attr } = props;
  const href = props.href;

  useTask$(() => {
    if (rule === "none") return;
    if (!rule && href?.startsWith("http")) return;
    const url = href === "/" ? "/index.html" : `${href}/index.html`;
    rules.push({ type: rule ?? "prefetch", eagerness, urls: [url] });
  });

  const attributes = mergeProps<"a">(attr, {
    class: "he-item he-item-anchor",
    "aria-current": isSamePathname(url.pathname, href) ? "page" : (null as any),
  });
  return (
    <a {...attributes}>
      <Slot />
    </a>
  );
});

export const ButtonItem = component$((props: PropsOf<"button">) => {
  useStyles$(style);
  const attributes = mergeProps<"button">(props, {
    class: "he-item he-item-button",
  });
  return (
    <li>
      <button {...attributes}>
        <Slot />
      </button>
    </li>
  );
});
