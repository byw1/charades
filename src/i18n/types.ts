/**
 * The shape every translation has to match.
 *
 * English is the source of truth: its object literal is typed `as const`, and
 * every other language is checked against the same tree with each string
 * widened, so a missing or misspelt key fails the typecheck rather than
 * showing up as English halfway through a game.
 */

export type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };

export const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;
export type PluralCategory = (typeof PLURAL_CATEGORIES)[number];

type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

/**
 * A plural is written as sibling keys, `cards_one` and `cards_other`, and
 * asked for by its stem: `t('cards', { count })`.
 */
type Stem<P> = P extends `${infer Base}_${PluralCategory}` ? Base : P;

export type KeyOf<T> = Stem<Leaves<T>>;

export type Params = Record<string, string | number>;
