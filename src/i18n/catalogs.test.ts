import { en } from './en';
import { getLocale, setLocale, SUPPORTED_LOCALES, t } from './index';
import { de } from './locales/de';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it as italian } from './locales/it';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { ptBR } from './locales/pt-BR';
import { zhHans } from './locales/zh-Hans';

type Tree = { [key: string]: string | Tree };

function leaves(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'string') out.set(prefix + key, value);
    else for (const [k, v] of leaves(value, `${prefix}${key}.`)) out.set(k, v);
  }
  return out;
}

const placeholders = (message: string) => [...message.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

const translations = { es, fr, de, 'pt-BR': ptBR, it: italian, ja, ko, 'zh-Hans': zhHans };
const english = leaves(en);

describe('translation catalogs', () => {
  it('covers every supported language', () => {
    expect(Object.keys(translations).sort()).toEqual(SUPPORTED_LOCALES.filter((l) => l !== 'en').sort());
  });

  describe.each(Object.entries(translations))('%s', (_locale, catalog) => {
    const messages = leaves(catalog as Tree);

    it('has exactly the English keys', () => {
      expect([...messages.keys()].sort()).toEqual([...english.keys()].sort());
    });

    it('keeps every placeholder', () => {
      const broken = [...english].filter(
        ([key, message]) => JSON.stringify(placeholders(messages.get(key) ?? '')) !== JSON.stringify(placeholders(message)),
      );
      expect(broken.map(([key]) => key)).toEqual([]);
    });

    it('has no empty messages', () => {
      expect([...messages].filter(([, message]) => message.trim() === '').map(([key]) => key)).toEqual([]);
    });
  });

  it('switches language', () => {
    const before = getLocale();
    try {
      setLocale('fr');
      expect(t('common.cancel')).toBe(fr.common.cancel);
      setLocale('en');
      expect(t('common.cancel')).toBe('Cancel');
    } finally {
      setLocale(before);
    }
  });
});
