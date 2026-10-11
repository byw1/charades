/**
 * The languages the app ships in, and how a phone's preferences map to one.
 *
 * Everything is bundled: the app never downloads a translation.
 */

export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt-BR', 'it', 'ja', 'ko', 'zh-Hans'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** The subset of expo-localization's Locale this needs. */
export type DeviceLocale = {
  languageCode: string | null;
  languageScriptCode?: string | null;
  regionCode?: string | null;
};

const TRADITIONAL_CHINESE_REGIONS = new Set(['TW', 'HK', 'MO']);

function match(device: DeviceLocale): Locale | null {
  const language = device.languageCode?.toLowerCase();
  switch (language) {
    case 'en':
    case 'es':
    case 'fr':
    case 'de':
    case 'it':
    case 'ja':
    case 'ko':
      return language;
    // Brazilian Portuguese reads naturally in Portugal too; the reverse is
    // less true, and Brazil is most of the audience.
    case 'pt':
      return 'pt-BR';
    // Only Simplified Chinese ships. Someone who reads Traditional falls
    // through to their next preferred language rather than getting the
    // script they did not choose.
    case 'zh': {
      const script = device.languageScriptCode ?? null;
      if (script === 'Hant') return null;
      if (script === 'Hans') return 'zh-Hans';
      return TRADITIONAL_CHINESE_REGIONS.has(device.regionCode?.toUpperCase() ?? '') ? null : 'zh-Hans';
    }
    default:
      return null;
  }
}

/**
 * The first of the phone's preferred languages that the app has, else
 * English. iOS lists them in the order set in Settings, and a per-app
 * language choice comes first.
 */
export function resolveLocale(preferred: readonly DeviceLocale[]): Locale {
  for (const device of preferred) {
    const locale = match(device);
    if (locale) return locale;
  }
  return 'en';
}
