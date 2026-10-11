/** The three-step new game flow: decks, teams, house rules (app/new). */
export const newGame = {
  decks: {
    title: 'Pick your decks',
    /** Same screen opened mid-game to swap decks without losing the score. */
    changeTitle: 'Change decks',
    subtitle: 'One, or mix a few.',
    changeSubtitle: 'Scores carry on. Mix in new ones or swap them out.',
    openError: 'Couldn’t open your decks',
    /** Screen reader label for a deck row: deck name, then its card count. */
    rowA11y_one: '{name}, {count} card',
    rowA11y_other: '{name}, {count} cards',
    cardCount_one: '{count} card',
    cardCount_other: '{count} cards',
    /** A deck with too few cards to play; it is greyed out. */
    cardCountTooFew_one: '{count} card · too few to play',
    cardCountTooFew_other: '{count} cards · too few to play',
    emptyTitle: 'No decks yet',
    emptyBody: 'Something went wrong opening the free decks.',
    /** Joins the chosen deck names in one line, e.g. "Movies, Animals". */
    listSeparator: ', ',
    /** Footer button, disabled until a deck is picked. Keep short. */
    pickAtLeastOne: 'Pick at least one',
    /** Footer button, disabled: the chosen decks have too few cards. Keep short. */
    cardsNeeded_one: '{count} card needed',
    cardsNeeded_other: '{count} cards needed',
    /** Footer button mid-game: put these decks into play. Keep short. */
    playThese_one: 'Play these · {count} card',
    playThese_other: 'Play these · {count} cards',
    /** Footer button: go to the next step. Keep short. */
    next_one: 'Next · {count} card',
    next_other: 'Next · {count} cards',
  },
  teams: {
    title: 'Who’s playing?',
    /** "I" and "me" in these screens are the app’s mascot talking to the players. */
    subtitle: 'Teams are optional. Names help me pass the phone round.',
    justPlay: {
      /** Option: play without teams. Keep short. */
      label: 'Just play',
      detail: 'Everyone together',
      a11y: 'Just play, no teams',
    },
    teamsMode: {
      /** Option: split into competing teams. Keep short. */
      label: 'Teams',
      detail: 'Split up and compete',
    },
    whosHere: 'Who’s here (optional)',
    soloHint: 'One name per line. I’ll rotate who holds the phone and keep everyone’s score.',
    howMany: 'How many teams',
    countA11y_one: '{count} team',
    countA11y_other: '{count} teams',
    /** Placeholder and screen reader label for the team name field. */
    teamName: 'Team name',
    notReady: 'Every team needs a name, and no two the same.',
    /** Placeholder for the player names box: three example first names, one per line. Use names common in your language. */
    playersPlaceholder: 'Sam\nAlex\nJo',
    playersA11y: 'Player names, one per line',
    /** Chip that adds a player from an earlier game. */
    addSuggestion: '+ {name}',
    addSuggestionA11y: 'Add {name}',
  },
  settings: {
    title: 'House rules',
    subtitle: 'Or just hit start. The defaults are good.',
    modeSection: 'Mode',
    /** Game modes, shown as small option chips: keep labels to a word or two. */
    modes: {
      classic: { label: 'Classic', help: 'Any clue goes' },
      /** Taboo-style: some words may not be said while giving clues. */
      taboo: { label: 'Banned', help: 'Some words off limits' },
      /** Three phases with the same cards: describe, one word, then mime. */
      threeRounds: { label: '3 Rounds', help: 'Talk, one word, act' },
    },
    /** How many cards go in the hat in three-round mode. */
    hatSize_one: '{count} card',
    hatSize_other: '{count} cards',
    hatSizeA11y_one: '{count} card in the hat',
    hatSizeA11y_other: '{count} cards in the hat',
    roundLength: 'Round length',
    /** Round length chip, abbreviated seconds, e.g. "60s". Keep very short. */
    seconds_one: '{count}s',
    seconds_other: '{count}s',
    secondsA11y_one: '{count} second rounds',
    secondsA11y_other: '{count} second rounds',
    endsOn: 'Game ends on',
    /** How the game ends, shown as small option chips: keep labels to a word or two. */
    ends: {
      rounds: { label: 'Rounds', help: 'Same turns each' },
      score: { label: 'Score', help: 'First to a target' },
      deckOut: { label: 'Deck out', help: 'Until cards run out' },
      endless: { label: 'Endless', help: 'Keep going' },
    },
    roundsEachA11y_one: '{count} round each',
    roundsEachA11y_other: '{count} rounds each',
    firstToA11y_one: 'First to {count} point',
    firstToA11y_other: 'First to {count} points',
    passing: 'Passing',
    pass: {
      free: { label: 'Free', detail: 'Pass all you like', a11y: 'Passes cost nothing' },
      penalty: { label: 'Costs a point', detail: 'Think before you skip' },
    },
    extras: 'Extras',
    chaos: {
      /** Option that adds a random silly rule to some rounds. */
      label: 'Chaos',
      detail: 'A wild rule some rounds',
      a11yOn: 'Chaos twists, on',
      a11yOff: 'Chaos twists, off',
    },
    forfeits: {
      /** Option: whoever comes last does a light dare. */
      label: 'Forfeits',
      detail: 'A dare for last place',
      a11yOn: 'Forfeits, on',
      a11yOff: 'Forfeits, off',
    },
    /** Start button while the game is being set up. */
    starting: 'Starting',
    start: 'Start game',
  },
} as const;
