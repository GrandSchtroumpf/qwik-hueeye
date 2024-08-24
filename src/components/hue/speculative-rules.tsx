import { component$, createContextId, useContext, useContextProvider, useStore } from "@builder.io/qwik";
import { Script } from "../script/script";
import { isDev } from "@builder.io/qwik/build";

type RuleType = 'prefetch' | 'prerender';
type RuleSource = 'list' | 'document';
export type Eagerness = "immediate" | "eager" | "moderate" | "conservative";
interface BaseRule {
  /**
   * A string providing a hint to the browser as to how eagerly it should prefetch/prerender link targets in order to balance performance advantages against resource overheads.
   * - **immediat**: The author thinks the link is very likely to be followed, and/or the document may take significant time to fetch. Prefetch/prerender should start as soon as possible, subject only to considerations such as user preferences and resource limits.
   * - **eager**: The author wants to prefetch/prerender a large number of navigations, as early as possible. Prefetch/prerender should start on any slight suggestion that a link may be followed. For example, the user could move their mouse cursor towards the link, hover/focus it for a moment, or pause scrolling with the link in a prominent place.
   * - **moderate**: The author is looking for a balance between eager and conservative. Prefetch/prerender should start when there is a reasonable suggestion that the user will follow a link in the near future. For example, the user could scroll a link into the viewport and hover/focus it for some time.
   * - **conservative**: The author wishes to get some benefit from speculative loading with a fairly small tradeoff of resources. Prefetch/prerender should start only when the user is starting to click on the link, for example on mousedown or pointerdown.
   * 
   * If "eagerness" is not explicitly specified, list ("urls") rules default to immediate and document ("where") rules default to conservative. The browser takes this hint into consideration along with its own heuristics, so it may select a link that the author has hinted as less eager than another, if the less eager candidate is considered a better choice.
   */
  eagerness?: Eagerness;
  /** A string providing a hint to the browser as to what No-Vary-Search header value will be set on responses for documents that it is receiving prefetch/prerender requests for. The browser can use this to determine ahead of time whether it is more useful to wait for an existing prefetch/prerender to finish, or start a new fetch request when the speculation rule is matched. See the "expects_no_vary_search" example for more explanation of how this can be used. */
  expects_no_vary_search?: string;
  /** A string representing a specific referrer policy string to use when requesting the URLs specified in the rule — see Referrer-Policy for possible values. The purpose of this is to allow the referring page to set a stricter policy specifically for the speculative request than the policy the page already has set (either by default, or by using Referrer-Policy). */
  referrer_policy?: ReferrerPolicy;
  /**
   * A string specifying where you want links matched by URL to be matched relative to. The value can be one of:
   * - **document**: URLs should be matched relative to the document the speculation rules are being set on.
   * - **ruleset**: URLs should be matched relative to the file the rules are specified in. This is the default value.
   * 
   * This key setting is only relevant for rules defined in an external file (set using the Speculation-Rules header). When rules are specified inside the same document they are being set for (i.e. in an inline <script> element), it makes no difference.
   */
  relative_to?: 'document' | 'ruleset';
}

interface ListRule extends BaseRule{
  source?: 'list';
  urls: string[];
}

interface DocumentRule extends BaseRule {
  source?: 'document';
  /** An object representing the conditions by which the rule matches URLs contained in the associated document. Effectively, the "where" object represents a test that is performed on every link on the page to see whether the speculation rule is applied to it. */
  where: ConditionalRule;
}

interface ConditionalRule {
  /** A string containing a URL pattern, or an array containing multiple URL pattern strings, which follow the standard URL Pattern API syntax. Links in the document whose URLs match the pattern(s) will have the rule applied. */
  href_matches?: string;
  /** In the case of an "href_matches" condition, this can specify where you want that condition to be matched relative to. This works in exactly the same way as the rule-level "relative_to" key, except that it only affects a single "href_matches" condition inside a "where" key. */
  relative_to?: 'document' | 'ruleset';
  /** A string containing a CSS selector, or an array containing multiple CSS selectors. Links in the document matched by those selectors will have the rule applied. */
  selector_matches?: string;
  and?: ConditionalRule[];
  not?: ConditionalRule;
  or?: ConditionalRule[];
}

export type SpeculativeRule = ListRule | DocumentRule;

type PrefectOnly<T> = T & {
  /** 
   * An array of strings representing capabilities of the browser parsing the rule, which must be available if the rule is to be applied to the specified URLs. Possible values are:
   * - **anonymous-client-ip-when-cross-origin**: Specifies that the rule matches only if the user agent can prevent the client IP address from being visible to the origin server if a cross-origin prefetch request is issued. Exactly how this works is dependent on browser implementation specifics.
   */
  requires?: 'anonymous-client-ip-when-cross-origin'[]
}

export interface SpeculativeRules {
  prerender?: SpeculativeRule[];
  prefetch?: PrefectOnly<SpeculativeRule>[];
}

export type SpeculativeRuleConfig = SpeculativeRule & {
  type: keyof SpeculativeRules;
}

export interface SpeculativeRuleMap {
  prerender: {
    list: Partial<{ [eagerness in Eagerness | 'default']: ListRule }>;
    document: Partial<{ [eagerness in Eagerness | 'default']: DocumentRule }>;
  }
  prefetch: {
    list: Partial<{ [eagerness in Eagerness | 'default']: ListRule }>;
    document: Partial<{ [eagerness in Eagerness | 'default']: DocumentRule }>;
  }
}

const SpeculativeRuleContext = createContextId<SpeculativeRuleConfig[]>('SpeculativeRuleContext');

export const useSpeculativeRulesProvider = () => {
  const state = useStore<SpeculativeRuleConfig[]>([]);
  useContextProvider(SpeculativeRuleContext, state);
  return state; 
}

export const useSpeculativeRules = () => useContext(SpeculativeRuleContext);

export const HueEyeSpeculativeRules = component$(() => {
  const state = useSpeculativeRules();
  if (isDev) return <></>;
  const rules: SpeculativeRules = {};
  const map: SpeculativeRuleMap = {
    prerender: { list: {}, document: {} },
    prefetch: { list: {}, document: {} },
  }

  // Intermediary mapping
  for (const config of state) {
    const eagerness = config.eagerness ?? 'default';
    if ('urls' in config) {
      map[config.type].list[eagerness] ||= { urls: [] };
      map[config.type].list[eagerness]!.urls.push(...config.urls);
    } else {
      map[config.type].document[eagerness] ||= { where: { or: [] } };
      map[config.type].document[eagerness]!.where.or!.push(config.where);
    }
  }

  for (const type in map) {
    for (const source in map[type as RuleType]) {
      for (const eagerness in map[type as RuleType][source as RuleSource]) {
        rules[type as RuleType] ||= [];
        const rule = map[type as RuleType][source as RuleSource][eagerness as Eagerness | 'default'];
        if (!rule) continue;
        if (eagerness === 'default') rules[type as RuleType]!.push(rule);
        else rules.prerender!.push({ ...rule, eagerness: eagerness as Eagerness });
      }
    }
  }
  return <Script type="speculationrules">
    {JSON.stringify(rules)}
  </Script>
})