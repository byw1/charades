/** Shared components and app-wide plumbing (database, media). */
export const ui = {
  topBar: {
    /** Accessibility label for the back chevron. */
    back: 'Back',
    /** Accessibility label for the close (X) button. */
    close: 'Close',
  },
  stepHeader: {
    /** Accessibility label for the X that leaves the new-game setup flow. */
    leaveSetup: 'Leave setup',
  },
  storyBar: {
    /** Accessibility label for the progress segments at the top of a multi-step flow. */
    step: 'Step {step} of {count}',
  },
  searchField: {
    placeholder: 'Search decks and cards',
  },
  loader: {
    /** Accessibility label while something loads. */
    loading: 'Loading',
    /** Short lines that rotate under the hopping mascot while loading; must be readable in under two seconds. Dex is the mascot's name. */
    lines: {
      shuffling: 'Shuffling the decks',
      wakingDex: 'Waking Dex up',
      findingCards: 'Finding the good cards',
      stretching: 'Stretching first',
    },
  },
  mascot: {
    /** The mascot's name, shown as the sender of chat-style messages. Keep it a short name. */
    name: 'Dex',
    /** Accessibility label for the mascot illustration. */
    a11yLabel: 'Dex, the Charades mascot',
  },
  deckCard: {
    /** Card count on a deck tile. */
    cards_one: '{count} card',
    cards_other: '{count} cards',
    /** Screen reader label for a deck tile. {cards} is the card count, e.g. “12 cards”. */
    a11yLabel: '{name}, {cards}',
    a11yLabelFavourite: '{name}, {cards}, favourite',
    notPlayableHint: 'Not enough cards to start a round',
    /** Small pill on a deck tile when the user added or hid cards in it. Keep very short, lowercase. */
    yours: '✏️ yours',
    /** Small pill on a deck tile that has too few cards for a round. Keep short, lowercase. */
    tooFew: 'too few to play',
  },
  cardFace: {
    /** Heading above the forbidden words on a Taboo-style card, shown on the phone held to someone's forehead. Keep very short, all caps. */
    dontSay: '🚫 DON’T SAY',
    /** Screen reader label for the forbidden words. {words} is a comma-separated list. */
    dontSayA11y: "Don't say {words}",
  },
  flash: {
    /** Full-screen flash after a correct guess, one picked at random. Shown huge, so 1–2 short words each. */
    correct: {
      gotIt: 'Got it',
      yesss: 'Yesss',
      nailedIt: 'Nailed it',
      easy: 'Easy',
      bigBrain: 'Big brain',
    },
    /** Full-screen flash after a pass, one picked at random. Shown huge, so one short word each. */
    pass: {
      pass: 'Pass',
      next: 'Next',
      skip: 'Skip',
    },
    /** Screen reader announcement for a correct guess. */
    correctA11y: 'Got it',
    /** Screen reader announcement for a pass. */
    passA11y: 'Pass',
    /** Full-screen flash when someone says a forbidden word. Shown huge, keep very short. */
    busted: 'Busted!',
    /** Screen reader announcement when a forbidden word was said. */
    bustedA11y: 'Busted: {word}',
    /** Under “Busted!”: which forbidden word was said. */
    someoneSaid: 'Someone said “{word}”',
  },
  emojiPicker: {
    title: 'Cover emoji',
    /** Accessibility label for each emoji in the grid. */
    use: 'Use {emoji}',
    typePlaceholder: 'Type any emoji',
    typeA11y: 'Type any emoji from your keyboard',
    typeHint: 'Tap here, then 😀 on your keyboard for every emoji there is.',
    /** Search placeholder; the examples should be words that find emoji in the built-in English keyword list. */
    searchPlaceholder: 'Search: pizza, party, dog…',
    noResults: 'Nothing for “{query}”. Try another word, or type it from your keyboard above.',
    /** {emoji} is the default deck emoji. */
    useDefault: 'Use the plain {emoji} instead',
    /** Emoji category headings, shown in capitals. */
    groups: {
      faces: 'Faces',
      party: 'Party',
      food: 'Food',
      animals: 'Animals',
      sports: 'Sports',
      places: 'Places & travel',
      things: 'Things',
    },
  },
  database: {
    /** Shown when the decks can't be loaded at launch. */
    openFailed: 'Charades could not open your decks. Restarting the app usually fixes it.',
    /** Shown after someone downgraded the app: the saved data is newer than this version understands. */
    tooNew:
      'This app is older than the data on this device (data version {current}, app reads up to {latest}). Update Charades to open your decks.',
    /** Shown when upgrading the saved decks failed. {step} is a number, {name} an internal step name. */
    migrationFailed: 'Could not update the deck database (step {step}, {name}).',
  },
} as const;
