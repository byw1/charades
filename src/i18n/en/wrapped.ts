/** Tonight, wrapped: the shareable story image of a game night. */
export const wrapped = {
  title: 'Wrapped',
  emptyTitle: 'Nothing to wrap yet',
  emptyBody: 'Play a round and your night shows up here.',
  // Button while the image is being made.
  making: 'Making it…',
  // Title of the system share sheet.
  shareDialogTitle: 'Share your night',
  unavailableTitle: 'Sharing isn’t available',
  failedTitle: 'Couldn’t make the image',
  screenshotHint: 'Take a screenshot instead: Side button + Volume Up.',

  // Everything below is drawn on the story image.
  story: {
    // All caps where the script has them.
    tonight: 'TONIGHT',
    // {when} is "TONIGHT" or a date. All caps where the script has them.
    overline: '{when}, WRAPPED',
    // Under the big number of cards guessed.
    cardsGuessed_one: 'card guessed',
    cardsGuessed_other: 'cards guessed',
    games_one: '{count} game',
    games_other: '{count} games',
    rounds_one: '{count} round',
    rounds_other: '{count} rounds',
    streak_one: '🔥 {count}-day streak',
    streak_other: '🔥 {count}-day streak',
    // {games}, {rounds} and {streak} are the three phrases above.
    summary: '{games} · {rounds}',
    summaryWithStreak: '{games} · {rounds} · {streak}',
    // Stand-in when a card's text can't be found.
    aCard: 'a card',
    // Row titles, shown in capitals.
    mvp: 'MVP',
    bestRound: 'Best round',
    fastest: 'Fastest guess',
    mostPassed: 'Nobody could get',
    busted: 'Busted',
    mvpValue_one: '{name} · {count} card',
    mvpValue_other: '{name} · {count} cards',
    // e.g. "8 in 60s": cards guessed in a round of that many seconds.
    bestRoundValue: '{cards} in {seconds}s',
    bestRoundValueNamed: '{name} · {cards} in {seconds}s',
    fastestValue: '“{card}” in {seconds}s',
    mostPassedValue: '“{card}”',
    mostPassedValueTimes: '“{card}” · passed {times}×',
    // Forbidden words said in Banned mode.
    bustedValue_one: '{count} forbidden word said',
    bustedValue_other: '{count} forbidden words said',
    decks: 'Decks: {names}',
    // Footer of the image. App name in caps, then a tagline.
    footer: 'CHARADES · make your own decks',
  },
} as const;
