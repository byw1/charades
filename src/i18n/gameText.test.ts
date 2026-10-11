import { badges } from '@/game/stats';
import { FORFEITS, forfeitFor, forfeitIndexFor } from '@/game/forfeits';
import { makeJustPlayTeam, makeTeams, DEFAULT_TEAM_NAMES } from '@/game/teams';
import { PHASES } from '@/game/threeRounds';
import { TWISTS } from '@/game/twists';

import { en } from './en';
import {
  badgeHint,
  badgeTitle,
  defaultTeamName,
  forfeitKey,
  forfeitText,
  phaseRule,
  phaseTitle,
  teamName,
  twistRule,
  twistTitle,
} from './gameText';
import { setLocale } from './index';
import { lookup } from './translate';

/**
 * src/game keeps the English text; the catalog carries it for translation.
 * These keep the two from drifting apart.
 */
describe('game text catalog', () => {
  beforeAll(() => setLocale('en'));

  it.each(TWISTS.map((twist) => [twist.id, twist] as const))('has twist %s', (id, twist) => {
    expect(twistTitle(id)).toBe(twist.title);
    expect(twistRule(id)).toBe(twist.rule);
  });

  it.each(PHASES.map((info) => [info.phase, info] as const))('has phase %s', (phase, info) => {
    expect(phaseTitle(phase)).toBe(info.title);
    expect(phaseRule(phase)).toBe(info.rule);
  });

  it('has every badge', () => {
    const all = badges({ rounds: 0, games: 0, cardsGuessed: 0, bestRound: 0, streak: 0, playedToday: false } as Parameters<typeof badges>[0]);
    for (const badge of all) {
      expect(badgeTitle(badge.id)).toBe(badge.title);
      expect(badgeHint(badge.id)).toBe(badge.hint);
    }
    expect(Object.keys(en.game.badges).sort()).toEqual(all.map((badge) => badge.id).sort());
  });

  it('has every forfeit, in order', () => {
    FORFEITS.forEach((text, index) => {
      expect(lookup(en, forfeitKey(index))).toBe(text);
    });
    expect(Object.keys(en.game.forfeits)).toHaveLength(FORFEITS.length);
  });

  it('shows the same forfeit forfeitFor picks', () => {
    for (const id of ['ses_a', 'ses_b', 'ses_123', 'x']) {
      expect(forfeitIndexFor(id)).toBeGreaterThanOrEqual(0);
      expect(forfeitText(id)).toBe(forfeitFor(id));
    }
  });

  it('has no twist or phase the game does not', () => {
    expect(Object.keys(en.game.twists).sort()).toEqual(TWISTS.map((t) => t.id).sort());
    expect(Object.keys(en.game.phases)).toHaveLength(PHASES.length);
  });

  it('has the default team names', () => {
    DEFAULT_TEAM_NAMES.forEach((name, index) => expect(defaultTeamName(index)).toBe(name));
    expect(defaultTeamName(DEFAULT_TEAM_NAMES.length)).toBe(DEFAULT_TEAM_NAMES[0]);
  });

  it('translates only the just-play team name', () => {
    const solo = [makeJustPlayTeam()];
    expect(teamName(solo[0]!, solo)).toBe(en.game.teams.everyone);
    const teams = makeTeams(2);
    expect(teamName(teams[0]!, teams)).toBe(teams[0]!.name);
  });
});
