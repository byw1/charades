import type { DeepString } from '../types';
import { common } from './common';
import { decks } from './decks';
import { editor } from './editor';
import { game } from './game';
import { home } from './home';
import { newGame } from './newGame';
import { round } from './round';
import { settings } from './settings';
import { ui } from './ui';
import { welcome } from './welcome';
import { wrapped } from './wrapped';

/**
 * Every UI string in English, the language the app is written in and the one
 * any other language falls back to. One file per area of the app.
 */
export const en = { common, home, welcome, settings, wrapped, newGame, game, round, decks, editor, ui } as const;

export type Messages = DeepString<typeof en>;
