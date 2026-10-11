import { forfeitIndexFor } from '@/game/forfeits';
import { DEFAULT_TEAM_NAMES, isJustPlay } from '@/game/teams';
import type { Team } from '@/game/types';

import { tDynamic } from './index';

/**
 * Game data (twists, three-round phases, forfeits, team names) in the phone's language.
 *
 * src/game keeps its English text so the logic and its tests stay pure; the
 * UI shows it through these helpers, keyed by id, which read
 * `game.twists.<id>`, `game.phases.<n>` and `game.forfeits.<index>`.
 * src/i18n/gameText.test.ts keeps the English catalog equal to src/game.
 */

export function twistTitle(twistId: string): string {
  return tDynamic(`game.twists.${twistId}.title`);
}

export function twistRule(twistId: string): string {
  return tDynamic(`game.twists.${twistId}.rule`);
}

export function phaseTitle(phase: number): string {
  return tDynamic(`game.phases.p${phase}.title`);
}

export function phaseRule(phase: number): string {
  return tDynamic(`game.phases.p${phase}.rule`);
}

/** Catalog key of a forfeit by its index in FORFEITS: f01, f02, ... */
export function forfeitKey(index: number): string {
  return `game.forfeits.f${String(index + 1).padStart(2, '0')}`;
}

export function forfeitText(sessionId: string): string {
  return tDynamic(forfeitKey(forfeitIndexFor(sessionId)));
}

/** Default name for the team at `index`, translated when the team is created. */
export function defaultTeamName(index: number): string {
  return tDynamic(`game.teams.defaults.t${(index % DEFAULT_TEAM_NAMES.length) + 1}`);
}

/**
 * A team's name for display. The just-play team stays stored as English
 * "Everyone" (isJustPlay relies on it), so it is translated here; every
 * other name is the players' own.
 */
export function teamName(team: Pick<Team, 'name'>, teams: readonly Team[]): string {
  return isJustPlay(teams) ? tDynamic('game.teams.everyone') : team.name;
}

export function badgeTitle(badgeId: string): string {
  return tDynamic(`game.badges.${badgeId}.title`);
}

export function badgeHint(badgeId: string): string {
  return tDynamic(`game.badges.${badgeId}.hint`);
}
