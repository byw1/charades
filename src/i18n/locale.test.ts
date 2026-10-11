import { resolveLocale } from './locale';

describe('resolveLocale', () => {
  it('uses the first preferred language the app has', () => {
    expect(resolveLocale([{ languageCode: 'nl' }, { languageCode: 'de' }, { languageCode: 'en' }])).toBe('de');
  });

  it('falls back to English', () => {
    expect(resolveLocale([{ languageCode: 'nl' }])).toBe('en');
    expect(resolveLocale([])).toBe('en');
    expect(resolveLocale([{ languageCode: null }])).toBe('en');
  });

  it('maps any Portuguese to Brazilian Portuguese', () => {
    expect(resolveLocale([{ languageCode: 'pt', regionCode: 'PT' }])).toBe('pt-BR');
  });

  it('uses Simplified Chinese only for people who read it', () => {
    expect(resolveLocale([{ languageCode: 'zh', languageScriptCode: 'Hans', regionCode: 'CN' }])).toBe('zh-Hans');
    expect(resolveLocale([{ languageCode: 'zh', regionCode: 'SG' }])).toBe('zh-Hans');
    expect(resolveLocale([{ languageCode: 'zh', languageScriptCode: 'Hant', regionCode: 'TW' }])).toBe('en');
    expect(resolveLocale([{ languageCode: 'zh', regionCode: 'HK' }, { languageCode: 'ja' }])).toBe('ja');
  });
});
