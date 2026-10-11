/** Home: the Decks, Play and You pages, and the card preview sheet. */
export const home = {
  // Bottom tab bar. Keep each to one short word.
  tabs: {
    decks: 'Decks',
    play: 'Play',
    me: 'You',
  },

  sort: {
    // Action sheet title when choosing how decks are ordered.
    title: 'Order decks by',
    message: 'Favourites always come first.',
    // The current choice in the sort sheet, with a tick after it.
    current: '{label} ✓',
    // Sort button label when nothing is chosen. Keep short.
    fallback: 'Sort',
    // Sort options, also shown on the small sort button. Keep short.
    mostPlayed: 'Most played',
    az: 'A–Z',
    newest: 'Newest',
  },

  resume: {
    title: 'Game in progress',
    // Button, keep short.
    button: 'Resume',
    notStarted: 'Not started yet',
    // Solo game summary on the resume banner.
    soloSummary_one: '{count} round · {score} pts',
    soloSummary_other: '{count} rounds · {score} pts',
    // One team's name and score on the resume banner, e.g. "Red 12".
    teamScore: '{team} {score}',
    accessibilityLabel: 'Game in progress, {summary}. Resume.',
  },

  decks: {
    title: 'Decks',
    importButton: 'Import a deck',
    newButton: 'New deck',
    loadError: 'Couldn’t open your decks',
    noMatchesTitle: 'Nothing matches that',
    noMatchesBody: 'No deck or card mentions “{query}”.',
    // Section heading: decks the user made.
    yours: 'Yours',
    // Section heading: decks that come with the app.
    free: 'Free decks',
    makeDeck: 'Make a deck',
    makeDeckDetail: 'Type cards, paste a list or add photos',
    groupDeckLabel: 'Make a deck about your group',
    groupDeckTitle: 'About your group',
    groupDeckDetail: 'Answer five questions, get a deck only you can play',
  },

  play: {
    // Name of the lens that plays every deck mixed together.
    mixName: 'Mix it up',
    cardCount_one: '{count} card',
    cardCount_other: '{count} cards',
    deckCount_one: '{count} deck',
    deckCount_other: '{count} decks',
    // Under the mixed lens: "{decks}" and "{cards}" are the two counts above.
    mixMeta: '{decks} · {cards}',
    // Small pill buttons on the deck. Keep very short.
    peek: 'Peek',
    pickDecks: 'Pick decks',
    fave: 'Fave',
    faved: 'Faved',
    modes: {
      // Game mode tabs, keep to one or two short words.
      classic: 'Classic',
      taboo: 'Banned',
      threeRounds: '3 Rounds',
    },
    // Hint line above the deck carousel for each mode.
    hints: {
      classic: 'Tap to play',
      taboo: 'Tap to play · some words are off limits',
      threeRounds: 'Tap to play · same cards, three ways',
    },
    modeLabel: '{mode} mode',
    roundLengthLabel: 'Round length {seconds} seconds. Tap to change.',
    // Round length on the timer button, e.g. "60s". Keep very short.
    roundLengthShort: '{seconds}s',
    starting: 'Starting…',
    needsCards_one: 'Needs {count} card · tap to open',
    needsCards_other: 'Needs {count} cards · tap to open',
    playDeck: 'Play {name}',
    yourStats: 'Your stats',
    streakLabel_one: '{count} day streak',
    streakLabel_other: '{count} day streak',
    sortLabel: 'Sort decks. Now: {sort}',
    teamsAndRules: 'Teams and rules',
  },

  preview: {
    close: 'Close preview',
    loading: 'Dealing the cards',
    empty: 'No cards to show yet.',
    counter: 'Card {index} of {total} · swipe for more',
    counterShuffled: 'A shuffled handful · Card {index} of {total} · swipe for more',
    // Buttons, keep short.
    play: 'Play these',
    edit: 'Edit cards',
    // Label above a card's forbidden words. All caps where the script has them.
    dontSay: '🚫 DON’T SAY',
    // Tag on a card the user wrote themselves. All caps, keep very short.
    yours: 'YOURS',
  },

  me: {
    title: 'You',
    settings: 'Settings',
    howToPlay: 'How to play',
    noGames: 'No games yet. Your first one starts a streak 🔥',
    streakZero: 'Streak’s at zero. Play today to start a new one.',
    streakToday_one: '{count} day in a row. Same time tomorrow?',
    streakToday_other: '{count} days in a row. Same time tomorrow?',
    streakPending_one: '{count}-day streak ⏳ play today to keep it alive',
    streakPending_other: '{count}-day streak ⏳ play today to keep it alive',
    // Under the big streak number.
    streakUnit_one: 'day streak',
    streakUnit_other: 'day streak',
    stats: {
      cardsGuessed: 'Cards guessed',
      bestRound: 'Best round',
      games: 'Games',
      rounds: 'Rounds',
    },
    wrappedLabel: 'Your night, wrapped. Make a story to share.',
    wrappedTitle: 'Tonight, wrapped',
    wrappedDetail: 'MVP, best round, most-passed card. One image to share.',
    friends: 'Friends',
    friendLabel: '{rank}. {name}: {wins} wins, {cards} cards guessed, {games} games',
    // Under a friend's name; {count} is the number of games.
    friendLine_one: '{cards} cards · best {best} · {count} game',
    friendLine_other: '{cards} cards · best {best} · {count} games',
    // Under a friend's win count.
    winsUnit_one: 'win',
    winsUnit_other: 'wins',
    rivalry: '⚔️ Biggest rivalry: {a} vs {b}, {aWins}–{bWins} across {games} games.',
    badgesHeading: 'Badges · {earned} of {total}',
    badgeEarnedLabel: '{title}, earned',
    badgeLockedLabel: '{title}, locked: {hint}',
    unlocked: 'Unlocked',
    privacy: 'Works offline. No accounts, no ads, no tracking. Your stats never leave this phone.',
  },
} as const;
