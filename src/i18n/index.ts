import { en, type Messages } from './en';
import { resolveLocale, type DeviceLocale, type Locale } from './locale';
import { de } from './locales/de';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it } from './locales/it';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { ptBR } from './locales/pt-BR';
import { zhHans } from './locales/zh-Hans';
import { translate } from './translate';
import type { KeyOf, Params } from './types';

export type { Locale } from './locale';
export { SUPPORTED_LOCALES } from './locale';

export type MessageKey = KeyOf<typeof en>;

const catalogs: Record<Locale, Messages> = {
  en,
  es,
  fr,
  de,
  'pt-BR': ptBR,
  it,
  ja,
  ko,
  'zh-Hans': zhHans,
};

let current: Locale = 'en';

/**
 * Picks the language from the phone's preferences. Called once, before the
 * first screen renders (app/_layout.tsx). iOS relaunches an app when its
 * language changes, so there is nothing to re-render live.
 *
 * Kept free of native imports so the pure logic tests can use `t` too.
 */
export function initLocale(preferred: readonly DeviceLocale[]): Locale {
  current = resolveLocale(preferred);
  return current;
}

/** For tests, and for anything that needs to force a language. */
export function setLocale(locale: Locale): void {
  current = locale;
}

export function getLocale(): Locale {
  return current;
}

/**
 * The UI string for `key` in the phone's language.
 *
 * Call it while rendering, never at module scope: a module-level constant is
 * built before the language is known and would stay English.
 */
export function t(key: MessageKey, params?: Params): string {
  return translate(current, catalogs[current], en, key, params);
}

/** `t` for a key built at runtime, such as `twists.${id}.title`. */
export function tDynamic(key: string, params?: Params): string {
  return translate(current, catalogs[current], en, key, params);
}
