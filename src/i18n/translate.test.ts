import { interpolate, lookup, translate } from './translate';

const en = {
  greeting: 'Hello, {name}',
  cards_one: '{count} card',
  cards_other: '{count} cards',
  nested: { deep: 'Deep' },
  onlyEnglish: 'Only in English',
};

const fr = {
  greeting: 'Bonjour, {name}',
  cards_one: '{count} carte',
  cards_other: '{count} cartes',
  nested: { deep: 'Profond' },
};

const ja = { cards_other: 'カード{count}枚' };

describe('translate', () => {
  it('finds nested keys', () => {
    expect(lookup(en, 'nested.deep')).toBe('Deep');
    expect(lookup(en, 'nested')).toBeUndefined();
    expect(lookup(en, 'greeting.more')).toBeUndefined();
  });

  it('fills placeholders and leaves unknown ones alone', () => {
    expect(interpolate('{a} and {b}', { a: 1 })).toBe('1 and {b}');
    expect(translate('fr', fr, en, 'greeting', { name: 'Ana' })).toBe('Bonjour, Ana');
  });

  it('picks the plural form for the language', () => {
    expect(translate('en', en, en, 'cards', { count: 1 })).toBe('1 card');
    expect(translate('en', en, en, 'cards', { count: 0 })).toBe('0 cards');
    // French treats zero as singular.
    expect(translate('fr', fr, en, 'cards', { count: 0 })).toBe('0 carte');
    expect(translate('fr', fr, en, 'cards', { count: 2 })).toBe('2 cartes');
  });

  it('falls back to the other form when a language has no singular', () => {
    expect(translate('ja', ja, en, 'cards', { count: 1 })).toBe('カード1枚');
  });

  it('falls back to English, then to the key itself', () => {
    expect(translate('fr', fr, en, 'onlyEnglish')).toBe('Only in English');
    expect(translate('fr', fr, en, 'missing.key')).toBe('missing.key');
  });
});
