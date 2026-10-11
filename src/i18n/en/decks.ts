/** Deck screens: a deck's page, import, share, the group-deck builder, and deck validation. */
export const decks = {
  cardCount_one: '{count} card',
  cardCount_other: '{count} cards',

  gone: {
    title: 'That deck is gone',
    body: 'It may have been deleted.',
  },

  /** Names given to a duplicated deck. {name} is the original deck's name. */
  copyName: {
    first: '{name} copy',
    /** {n} is 2, 3, 4… */
    numbered: '{name} copy {n}',
  },

  detail: {
    backToDecks: 'Back to decks',
    goneBody: 'It may have been deleted. Head back and pick another.',
    /** Small pill under the deck name. */
    byAuthor: 'by {author}',
    /** Small pill: a deck that came with the app. */
    freeDeck: 'Free deck',
    playButton: 'Play this deck',
    moreToPlay_one: 'Add {count} more card to play this deck.',
    moreToPlay_other: 'Add {count} more cards to play this deck.',
    /** Round action button label, keep short. */
    favourite: 'Favourite',
    favourited: 'Favourited',
    /** Round action button label, keep short. */
    copy: 'Copy',
    copying: 'Copying',
    duplicate: 'Duplicate',
    freeDeckHint:
      'Edit to hide cards or add your own; your changes stay when the app updates this deck. Copy it to change everything.',
    whatsInside: 'What’s inside',
    /** Tiny badge on a card the user added to a free deck. */
    yoursBadge: 'YOURS',
    emptyTitle: 'This deck is empty',
    emptyBody: 'There are no cards in it yet.',
    deleteConfirm: {
      title: 'Delete {name}?',
      message_one: '{count} card will go with it. This can’t be undone.',
      message_other: '{count} cards will go with it. This can’t be undone.',
      keep: 'Keep',
    },
  },

  import: {
    title: 'Import a deck',
    deckUpdated: 'Deck updated!',
    deckAdded: 'Deck added!',
    doneSummary_one: '{name} · {count} card',
    doneSummary_other: '{name} · {count} cards',
    doneSummaryCopy_one: '{name} · {count} card · saved as a copy',
    doneSummaryCopy_other: '{name} · {count} cards · saved as a copy',
    openIt: 'Open it',
    importAnother: 'Import another',
    previewTitle: 'Add this deck?',
    previewCountByAuthor_one: '{count} card · by {author}',
    previewCountByAuthor_other: '{count} cards · by {author}',
    /** Chip after a few sample cards. */
    moreCards: '+{count} more',
    collisionTitle: 'YOU ALREADY HAVE THIS DECK',
    collisionBody: 'Replacing overwrites your copy, including any changes you made. Keeping both is always safe.',
    keepBoth: 'Keep both',
    replaceMine: 'Replace mine',
    addThisDeck: 'Add this deck',
    notNow: 'Not now',
    /** Tabs for how to import, keep short. */
    methods: {
      scan: 'Scan',
      paste: 'Paste',
      file: 'File',
    },
    /** Over the camera while collecting a big deck shown as several codes. */
    scanProgress: 'Got {have} of {total} codes. Keep it there…',
    scanHint: 'Point at a Charades code',
    /** Said by the mascot before asking for camera permission. */
    cameraExplainer: 'I only use the camera to read deck codes. No photos are taken or kept.',
    openSettings: 'Open Settings',
    allowCamera: 'Allow camera',
    pastePlaceholder: 'Paste a deck link or a deck code',
    pasteLabel: 'Deck link or code',
    importButton: 'Import',
    fileExplainer: 'Open a .charades file someone sent you — from Messages, Mail, Files or AirDrop.',
    chooseFile: 'Choose a file',
  },

  share: {
    title: 'Share deck',
    /** Title of the iOS share sheet. */
    dialogTitle: 'Share {name}',
    headlineQr: 'Point a friend’s camera at this.',
    headlineParts: 'Big deck! Hold their camera on this till it’s got every code.',
    headlineTooBig: 'Too big for a code. Send it as a file.',
    subtitle_one: '{name} · {count} card',
    subtitle_other: '{name} · {count} cards',
    tooBigBody:
      'This deck has {count} cards, which is more than a few codes can hold. A file works exactly the same at the other end.',
    photosNote_one: '📷 {count} photo only travels in the file. Codes and links carry the words.',
    photosNote_other: '📷 {count} photos only travel in the file. Codes and links carry the words.',
    preparing: 'Preparing',
    sendFile: 'Send as a file',
    sendFileHint: 'Opens the share sheet with a .charades file',
    copied: 'Copied ✓',
    copyLink: 'Copy link',
    copyLinkHint: 'Copies a link that opens this deck in Charades',
    footer: 'The whole deck travels inside the code, link or file. Nothing is uploaded anywhere.',
    /** A big deck shown as a looping sequence of QR codes. */
    flipbook: {
      a11yPlaying: 'Code {index} of {total}. Tap to pause.',
      a11yPaused: 'Code {index} of {total}. Paused. Tap to carry on.',
      caption: 'Code {index} of {total} · tap to pause',
      captionPaused: 'Code {index} of {total} · paused, tap to carry on',
    },
  },

  /** "A deck about your group": a few questions, every answer becomes a card. */
  group: {
    tallyShort_one: '{count} card so far · {short} more to play',
    tallyShort_other: '{count} cards so far · {short} more to play',
    tallyReady_one: '{count} card so far · ready to play',
    tallyReady_other: '{count} cards so far · ready to play',
    /** Button when a question is left blank. */
    skip: 'Skip',
    faces: {
      title: '📸 Faces',
      subtitle: 'Pick photos of the group and name each one. The room sees the face; the guesser has to say the name.',
      namePlaceholder: 'Who’s this?',
      nameLabel: 'Name for photo {index}',
      removeLabel: 'Remove photo {index}',
      adding: 'Adding…',
      addMore: 'Add more photos',
      choose: 'Choose photos',
    },
    nameStep: {
      title: '🎉 Name it',
      subtitle: 'Pick a name and a colour.',
      nameLabel: 'Deck name',
      /** {colour} is a hex value such as #FF3D6E. */
      colourLabel: 'Deck colour {colour}',
      shortHint_one: '{count} more card and it’s playable. Make it now and add the rest in the editor.',
      shortHint_other: '{count} more cards and it’s playable. Make it now and add the rest in the editor.',
      making: 'Making it…',
      make: 'Make the deck',
    },
    /** Name of a group deck nobody named. Saved as the deck's name. */
    defaultName: 'The Group Chat',
    /** Saved as the group deck's description. */
    deckDescription: 'Made by the group, about the group. Only the people in the room can play this one.',
    /** Clue-giver hint on a catchphrase card; {name} is who says it. Saved on the card. */
    saysIt: 'Says it: {name}',
    /**
     * The questions. `example` is shown faintly in the empty box, one example
     * per line; replace with names and places natural in your language. A
     * "|" separates a card from its hint and must stay.
     */
    prompts: {
      people: {
        title: 'Who’s in the group?',
        hint: 'Friends, roommates, the one who always shows up late. One per line.',
        example: 'Sam\nAlex\nJo’s mum',
      },
      places: {
        title: 'Where do you all end up?',
        hint: 'The diner, someone’s couch, that one parking lot.',
        example: 'Taco Tuesday spot\nThe library basement\nAlex’s car',
      },
      jokes: {
        title: 'Inside jokes',
        hint: 'The stuff nobody outside the group would get.',
        example: 'The great pizza incident\nCanoe trip\nThe group chat name',
      },
      sayings: {
        title: 'Things someone always says',
        hint: 'Catchphrases. Add who says it after a | if you like.',
        example: 'Five more minutes | Jo\nIt’s giving | Sam',
      },
      obsessions: {
        title: 'What you’re all obsessed with',
        hint: 'Shows, songs, games, snacks, that one TikTok.',
        example: 'Love Island\nMario Kart\nSpicy ramen',
      },
    },
  },

  /** Why a shared deck can't be opened. Shown on the import screen. */
  decode: {
    empty: 'There is nothing here to import.',
    notADeck: 'This does not look like a Charades deck.',
    newerVersion: 'This deck was shared from a newer version of Charades. Update the app to open it.',
    damaged: 'This deck is damaged and cannot be read.',
    unreadable: 'This deck cannot be read.',
  },

  /**
   * Problems found in a deck, shown to the person importing or editing it.
   * {index} is a card's position, starting at 1.
   */
  validation: {
    notADeck: 'This file does not contain a deck.',
    missingVersion: 'This file is missing a deck version, so it cannot be read as a deck.',
    newerVersion:
      'This deck was made with a newer version of Charades (deck version {version}, this app reads up to {supported}). Update the app to open it.',
    invalidVersion: 'This deck has an invalid version number.',
    noId: 'This deck has no identifier.',
    badId: 'This deck has an identifier the app does not recognise.',
    noName: 'A deck needs a name.',
    nameTooLong: 'Deck names are limited to {max} characters.',
    descriptionNotText: 'The deck description is not text.',
    descriptionTooLong: 'Deck descriptions are limited to {max} characters.',
    authorNotText: 'The deck author is not text.',
    authorTooLong: 'Author names are limited to {max} characters.',
    languageNotText: 'The deck language is not text.',
    noColour: 'This deck has no colour.',
    /** {value} is what the file had instead of a colour. */
    badColour: '"{value}" is not a colour the app can read. Use a hex value like #FF3D6E.',
    badEmoji: 'This deck’s cover emoji could not be read, so it will use the default.',
    tagsNotList: 'Deck tags are not a list of text.',
    tooManyTags: 'Decks are limited to {max} tags.',
    tagTooLong: 'Tags are limited to {max} characters.',
    badDate: 'This deck has an unreadable date.',
    noCards: 'This deck has no cards list.',
    tooManyCards: 'Decks are limited to {max} cards. This one has {count}.',
    cardNotACard: 'Card {index} is not a card.',
    cardNoId: 'Card {index} has no identifier.',
    cardBadId: 'Card {index} has an identifier the app does not recognise.',
    duplicateCardId: 'Two cards share the same identifier ({id}).',
    cardNoText: 'Card {index} has no text.',
    cardEmpty: 'Card {index} is empty.',
    /** {start} is the first 30 characters of the card. */
    cardTooLong: '"{start}…" is {length} characters. Anything over {max} is hard to read at arm\'s length.',
    hintNotText: 'The hint on card {index} is not text.',
    hintTooLong: 'Hints are limited to {max} characters.',
    tabooNotList: 'The banned words on card {index} are not a list of text.',
    tooManyTaboo: 'Cards are limited to {max} banned words.',
    tabooTooLong: 'Banned words are limited to {max} characters.',
    badPhoto: 'The photo on card {index} is not a picture the app can show.',
    photoTooLarge: 'The photo on card {index} is too large.',
    tooFewCards_one: 'This deck has {count} card. It needs {min} to start a round.',
    tooFewCards_other: 'This deck has {count} cards. It needs {min} to start a round.',
  },
} as const;
