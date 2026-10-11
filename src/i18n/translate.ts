import type { Params, PluralCategory } from './types';

type Tree = { [key: string]: string | Tree };

/**
 * Looks up a dotted key in a message tree.
 *
 * Pure, so it is tested without React Native. The app's own `t` in
 * ./index.ts wraps this with the language the phone is set to.
 */
export function lookup(tree: Tree, key: string): string | undefined {
  let node: string | Tree | undefined = tree;
  for (const part of key.split('.')) {
    if (node === undefined || typeof node === 'string') return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
}

const pluralRules = new Map<string, Intl.PluralRules | null>();

function pluralCategory(locale: string, count: number): PluralCategory {
  if (!pluralRules.has(locale)) {
    try {
      pluralRules.set(locale, new Intl.PluralRules(locale));
    } catch {
      pluralRules.set(locale, null);
    }
  }
  const rules = pluralRules.get(locale);
  if (rules) return rules.select(count) as PluralCategory;
  return count === 1 ? 'one' : 'other';
}

/** Replaces `{name}` with the matching param. Unknown names are left alone. */
export function interpolate(message: string, params?: Params): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole,
  );
}

/**
 * Resolves a message: the plural form for `count` when there is one, then the
 * plain key, in the chosen language and then in English. A key missing from
 * both comes back as itself, which is ugly enough to be noticed but never
 * crashes a round.
 */
export function translate(
  locale: string,
  messages: Tree,
  fallback: Tree,
  key: string,
  params?: Params,
): string {
  const count = typeof params?.count === 'number' ? params.count : undefined;

  for (const [tree, treeLocale] of [
    [messages, locale],
    [fallback, 'en'],
  ] as const) {
    if (count !== undefined) {
      const plural =
        lookup(tree, `${key}_${pluralCategory(treeLocale, count)}`) ?? lookup(tree, `${key}_other`);
      if (plural !== undefined) return interpolate(plural, params);
    }
    const message = lookup(tree, key);
    if (message !== undefined) return interpolate(message, params);
  }

  return key;
}
