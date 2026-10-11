import { makeCardId, makeDeckId, type RandomSource } from './ids';
import { CARD_TEXT_SOFT_CAP, CURRENT_DECK_SCHEMA_VERSION, type Card, type Deck } from './types';
import { getLocale, t } from '@/i18n';

/**
 * "A deck about your group."
 *
 * A few questions about the friend group, and every answer becomes a card.
 * The best decks are the ones only the people in the room could play, and
 * nobody sits down to write one from a blank page; answering "where do you
 * all end up?" is easy.
 */

export type GroupPrompt = {
  id: string;
  emoji: string;
  title: string;
  hint: string;
  /** Shown faintly in the empty box, one example per line. */
  example: string;
};

type PromptId = 'people' | 'places' | 'jokes' | 'sayings' | 'obsessions';

/**
 * The words are looked up each time they are read, so they follow the
 * phone's language even though this list is built when the module loads.
 */
function prompt(id: PromptId, emoji: string): GroupPrompt {
  return {
    id,
    emoji,
    get title() {
      return t(`decks.group.prompts.${id}.title`);
    },
    get hint() {
      return t(`decks.group.prompts.${id}.hint`);
    },
    get example() {
      return t(`decks.group.prompts.${id}.example`);
    },
  };
}

export const GROUP_PROMPTS: readonly GroupPrompt[] = [
  prompt('people', '👯'),
  prompt('places', '📍'),
  prompt('jokes', '😂'),
  prompt('sayings', '💬'),
  prompt('obsessions', '📺'),
];

export type GroupPhoto = { image: string; name: string };

export type GroupAnswers = {
  answers: Readonly<Record<string, string>>;
  photos?: readonly GroupPhoto[];
  name?: string;
  accentColor: string;
  now: string;
  random?: RandomSource;
};

/** The name a group deck gets when nobody names it, in the phone's language. */
export function defaultGroupDeckName(): string {
  return t('decks.group.defaultName');
}

/** Every line of every answer, de-duplicated, as cards. Photos come first. */
export function groupCards(input: Pick<GroupAnswers, 'answers' | 'photos' | 'random'>): Card[] {
  const seen = new Set<string>();
  const cards: Card[] = [];

  const add = (text: string, note: string | null, image?: string) => {
    const clean = text.trim().slice(0, CARD_TEXT_SOFT_CAP);
    const key = clean.toLocaleLowerCase();
    if (!clean || seen.has(key)) return;
    seen.add(key);
    const card: Card = { id: makeCardId(input.random), text: clean, note };
    if (image) card.image = image;
    cards.push(card);
  };

  for (const photo of input.photos ?? []) add(photo.name, null, photo.image);

  for (const prompt of GROUP_PROMPTS) {
    const answer = input.answers[prompt.id] ?? '';
    for (const line of answer.split(/\r?\n/)) {
      const pipe = line.indexOf('|');
      const text = pipe === -1 ? line : line.slice(0, pipe);
      const note = pipe === -1 ? null : line.slice(pipe + 1).trim() || null;
      // A catchphrase card shows the phrase; who says it is the clue-giver's hint.
      add(text, prompt.id === 'sayings' && note ? t('decks.group.saysIt', { name: note }) : note);
    }
  }

  return cards;
}

export function buildGroupDeck(input: GroupAnswers): Deck {
  return {
    schemaVersion: CURRENT_DECK_SCHEMA_VERSION,
    id: makeDeckId(input.random),
    name: input.name?.trim() || defaultGroupDeckName(),
    description: t('decks.group.deckDescription'),
    author: '',
    language: getLocale(),
    accentColor: input.accentColor,
    emoji: '👯',
    tags: ['group', 'custom'],
    createdAt: input.now,
    updatedAt: input.now,
    cards: groupCards(input),
  };
}
