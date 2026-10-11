import { isCardId, isDeckId } from './ids';
import {
  CARD_TEXT_SOFT_CAP,
  CURRENT_DECK_SCHEMA_VERSION,
  type Card,
  type Deck,
  MAX_DECK_EMOJI_LENGTH,
  MAX_IMAGE_DATA_LENGTH,
  MAX_TABOO_WORD_LENGTH,
  MAX_TABOO_WORDS,
  MIN_PLAYABLE_CARDS,
} from './types';
import { parseHexColor } from '@/ui/contrast';
import { t } from '@/i18n';

/**
 * Deck validation.
 *
 * This runs on untrusted input — QR payloads, files, pasted text — so it takes
 * `unknown` and proves the shape rather than trusting a cast. Messages are
 * written for the person doing the import, not for a developer, because they
 * surface directly on the import preview screen.
 *
 * Errors reject the deck. Warnings let it through and are shown alongside the
 * preview, because a deck that is merely awkward is still the user's deck and
 * the spec says nothing they create can be lost.
 */

export type ValidationIssue = {
  /** Dotted path to the offending field, for example `cards[3].text`. */
  path: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; deck: Deck; warnings: ValidationIssue[] }
  | { ok: false; reason: FailureReason; errors: ValidationIssue[]; warnings: ValidationIssue[] };

/**
 * Distinguished so the import screen can explain a future-version deck
 * differently from a corrupt one. One means "update the app", the other means
 * "this file is broken".
 */
export type FailureReason = 'malformed' | 'unsupportedSchemaVersion';

const MAX_NAME_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 280;
const MAX_AUTHOR_LENGTH = 40;
const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 24;
const MAX_NOTE_LENGTH = 140;
/** Guards against a decompression bomb arriving by QR or file in M5. */
const MAX_CARDS = 2000;

/** JPEG, PNG or WebP, base64-encoded. Nothing that could be fetched. */
const IMAGE_DATA_URI = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

/** Trims, drops blanks and de-duplicates case-insensitively. */
export function normaliseTaboo(words: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of words) {
    const word = raw.trim();
    const key = word.toLocaleLowerCase();
    if (!word || seen.has(key)) continue;
    seen.add(key);
    out.push(word);
  }
  return out;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && /^\d{4}-\d{2}-\d{2}T/.test(value);
}

/**
 * Validates a parsed deck document.
 *
 * Takes already-parsed JSON rather than a string, so that JSON syntax errors
 * are reported by the caller with the context it has (which file, which QR).
 */
export function validateDeck(input: unknown): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const fail = (path: string, message: string) => errors.push({ path, message });
  const warn = (path: string, message: string) => warnings.push({ path, message });

  if (!isRecord(input)) {
    return {
      ok: false,
      reason: 'malformed',
      errors: [{ path: '', message: t('decks.validation.notADeck') }],
      warnings,
    };
  }

  // Schema version is checked first and on its own. A deck from a future
  // version may legitimately have a shape this build cannot read, so reporting
  // field errors against it would be noise at best and misleading at worst.
  const { schemaVersion } = input;
  if (typeof schemaVersion !== 'number' || !Number.isInteger(schemaVersion)) {
    return {
      ok: false,
      reason: 'malformed',
      errors: [
        {
          path: 'schemaVersion',
          message: t('decks.validation.missingVersion'),
        },
      ],
      warnings,
    };
  }
  if (schemaVersion > CURRENT_DECK_SCHEMA_VERSION) {
    return {
      ok: false,
      reason: 'unsupportedSchemaVersion',
      errors: [
        {
          path: 'schemaVersion',
          message: t('decks.validation.newerVersion', {
            version: schemaVersion,
            supported: CURRENT_DECK_SCHEMA_VERSION,
          }),
        },
      ],
      warnings,
    };
  }
  if (schemaVersion < 1) {
    return {
      ok: false,
      reason: 'malformed',
      errors: [{ path: 'schemaVersion', message: t('decks.validation.invalidVersion') }],
      warnings,
    };
  }

  const id = typeof input.id === 'string' ? input.id : '';
  if (!id) {
    fail('id', t('decks.validation.noId'));
  } else if (!isDeckId(id)) {
    fail('id', t('decks.validation.badId'));
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name) {
    fail('name', t('decks.validation.noName'));
  } else if (name.length > MAX_NAME_LENGTH) {
    fail('name', t('decks.validation.nameTooLong', { max: MAX_NAME_LENGTH }));
  }

  const description = typeof input.description === 'string' ? input.description : '';
  if (input.description !== undefined && typeof input.description !== 'string') {
    fail('description', t('decks.validation.descriptionNotText'));
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    fail('description', t('decks.validation.descriptionTooLong', { max: MAX_DESCRIPTION_LENGTH }));
  }

  const author = typeof input.author === 'string' ? input.author : '';
  if (input.author !== undefined && typeof input.author !== 'string') {
    fail('author', t('decks.validation.authorNotText'));
  } else if (author.length > MAX_AUTHOR_LENGTH) {
    fail('author', t('decks.validation.authorTooLong', { max: MAX_AUTHOR_LENGTH }));
  }

  const language = typeof input.language === 'string' && input.language ? input.language : 'en';
  if (input.language !== undefined && typeof input.language !== 'string') {
    fail('language', t('decks.validation.languageNotText'));
  }

  const accentColor = typeof input.accentColor === 'string' ? input.accentColor : '';
  if (!accentColor) {
    fail('accentColor', t('decks.validation.noColour'));
  } else if (!parseHexColor(accentColor)) {
    fail('accentColor', t('decks.validation.badColour', { value: accentColor }));
  }

  // Cosmetic, so a bad one is dropped with a warning rather than failing the deck.
  let emoji: string | null = null;
  if (input.emoji !== undefined && input.emoji !== null) {
    const raw = typeof input.emoji === 'string' ? input.emoji.trim() : '';
    if (raw && raw.length <= MAX_DECK_EMOJI_LENGTH && /\p{Extended_Pictographic}/u.test(raw)) {
      emoji = raw;
    } else {
      warn('emoji', t('decks.validation.badEmoji'));
    }
  }

  let tags: string[] = [];
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags) || input.tags.some((t) => typeof t !== 'string')) {
      fail('tags', t('decks.validation.tagsNotList'));
    } else {
      tags = (input.tags as string[]).map((t) => t.trim()).filter(Boolean);
      if (tags.length > MAX_TAGS) {
        fail('tags', t('decks.validation.tooManyTags', { max: MAX_TAGS }));
      }
      if (tags.some((t) => t.length > MAX_TAG_LENGTH)) {
        fail('tags', t('decks.validation.tagTooLong', { max: MAX_TAG_LENGTH }));
      }
    }
  }

  for (const field of ['createdAt', 'updatedAt'] as const) {
    if (!isIsoDate(input[field])) {
      fail(field, t('decks.validation.badDate'));
    }
  }

  const cards: Card[] = [];
  if (!Array.isArray(input.cards)) {
    fail('cards', t('decks.validation.noCards'));
  } else if (input.cards.length > MAX_CARDS) {
    fail('cards', t('decks.validation.tooManyCards', { max: MAX_CARDS, count: input.cards.length }));
  } else {
    const seenCardIds = new Set<string>();

    input.cards.forEach((raw, index) => {
      const path = `cards[${index}]`;
      if (!isRecord(raw)) {
        fail(path, t('decks.validation.cardNotACard', { index: index + 1 }));
        return;
      }

      const cardId = typeof raw.id === 'string' ? raw.id : '';
      if (!cardId) {
        fail(`${path}.id`, t('decks.validation.cardNoId', { index: index + 1 }));
      } else if (!isCardId(cardId)) {
        fail(`${path}.id`, t('decks.validation.cardBadId', { index: index + 1 }));
      } else if (seenCardIds.has(cardId)) {
        // Duplicate ids would make seen-card tracking mark two cards at once.
        fail(`${path}.id`, t('decks.validation.duplicateCardId', { id: cardId }));
      } else {
        seenCardIds.add(cardId);
      }

      const text = typeof raw.text === 'string' ? raw.text.trim() : '';
      if (typeof raw.text !== 'string') {
        fail(`${path}.text`, t('decks.validation.cardNoText', { index: index + 1 }));
      } else if (!text) {
        fail(`${path}.text`, t('decks.validation.cardEmpty', { index: index + 1 }));
      } else if (text.length > CARD_TEXT_SOFT_CAP) {
        // Soft cap: allowed, but it will be small on the card.
        warn(
          `${path}.text`,
          t('decks.validation.cardTooLong', { start: text.slice(0, 30), length: text.length, max: CARD_TEXT_SOFT_CAP }),
        );
      }

      let note: string | null = null;
      if (raw.note !== undefined && raw.note !== null) {
        if (typeof raw.note !== 'string') {
          fail(`${path}.note`, t('decks.validation.hintNotText', { index: index + 1 }));
        } else if (raw.note.length > MAX_NOTE_LENGTH) {
          fail(`${path}.note`, t('decks.validation.hintTooLong', { max: MAX_NOTE_LENGTH }));
        } else {
          note = raw.note.trim() || null;
        }
      }

      let taboo: string[] = [];
      if (raw.taboo !== undefined && raw.taboo !== null) {
        if (!Array.isArray(raw.taboo) || raw.taboo.some((t) => typeof t !== 'string')) {
          fail(`${path}.taboo`, t('decks.validation.tabooNotList', { index: index + 1 }));
        } else {
          taboo = normaliseTaboo(raw.taboo as string[]);
          if (taboo.length > MAX_TABOO_WORDS) {
            fail(`${path}.taboo`, t('decks.validation.tooManyTaboo', { max: MAX_TABOO_WORDS }));
          } else if (taboo.some((t) => t.length > MAX_TABOO_WORD_LENGTH)) {
            fail(`${path}.taboo`, t('decks.validation.tabooTooLong', { max: MAX_TABOO_WORD_LENGTH }));
          }
        }
      }

      let image: string | null = null;
      if (raw.image !== undefined && raw.image !== null) {
        if (typeof raw.image !== 'string' || !IMAGE_DATA_URI.test(raw.image)) {
          fail(`${path}.image`, t('decks.validation.badPhoto', { index: index + 1 }));
        } else if (raw.image.length > MAX_IMAGE_DATA_LENGTH) {
          fail(`${path}.image`, t('decks.validation.photoTooLarge', { index: index + 1 }));
        } else {
          image = raw.image;
        }
      }

      if (cardId && text) {
        const card: Card = { id: cardId, text, note };
        if (taboo.length > 0) card.taboo = taboo;
        if (image) card.image = image;
        cards.push(card);
      }
    });
  }

  if (errors.length > 0) {
    return { ok: false, reason: 'malformed', errors, warnings };
  }

  // Not an error. The spec allows a short deck to exist, it just cannot start
  // a round, and the deck browser says so.
  if (cards.length < MIN_PLAYABLE_CARDS) {
    warn('cards', t('decks.validation.tooFewCards', { count: cards.length, min: MIN_PLAYABLE_CARDS }));
  }

  const deck: Deck = {
    schemaVersion,
    id,
    name,
    description,
    author,
    language,
    accentColor,
    tags,
    createdAt: input.createdAt as string,
    updatedAt: input.updatedAt as string,
    cards,
  };
  if (emoji) deck.emoji = emoji;

  return { ok: true, warnings, deck };
}
