/** The deck editor, and the editor for making a free deck your own. */
export const editor = {
  closeEditor: 'Close editor',
  newDeck: 'New deck',
  editDeck: 'Edit deck',
  /** Shown in the preview banner while the deck has no name. */
  untitled: 'Your deck',
  /** Default text of a card made from a photo, until it is named. {n} counts the photo cards. */
  photoCardName: 'Photo {n}',

  photosAdded: {
    title_one: 'Photo added',
    title_other: '{count} photos added',
    body: 'Give each one a name: that’s what the room has to get the guesser to say.',
  },
  photoMenu: {
    titleChange: 'Card photo',
    titleAdd: 'Add a photo',
    library: 'Choose from library',
    camera: 'Take a photo',
    remove: 'Remove photo',
  },
  leave: {
    title: 'Leave without saving?',
    body: 'Your changes to this deck will be lost.',
    keepEditing: 'Keep editing',
    discard: 'Discard',
  },
  paste: {
    title: 'Paste a list',
    intro: 'One card per line. Add a hint for clue-givers after a pipe:',
    /** The format to type. Keep the "|". */
    format: 'Card text | hint',
    /** Example list. Keep one card per line and the "|" before the hint. */
    placeholder: 'My Chemical Romance\nFall Out Boy | They sang Sugar\nParamore',
    label: 'Cards, one per line',
    addThem: 'Add them',
    resultTitle: 'Pasted',
    added: 'Added {count}.',
    skipped: 'Skipped {count} already here.',
    overLength: '{count} over {max} characters — they’ll be small on the card.',
  },

  deckNamePlaceholder: 'Deck name',
  deckNameLabel: 'Deck name',
  descriptionPlaceholder: 'What’s in it? (optional)',
  descriptionLabel: 'Deck description',
  /** {colour} is a hex value such as #FF3D6E. */
  colourLabel: 'Deck colour {colour}',
  changeEmojiLabel: 'Change the cover emoji',
  emojiButtonLabel: 'Cover emoji. Type one or search.',
  coverEmoji: 'Cover emoji',
  coverEmojiHint: 'Type any emoji, or search for one',
  moreToPlay: '{count} more to play',
  readyToPlay: 'Ready to play!',
  newCardPlaceholder: 'Type a card and hit return',
  newCardLabel: 'New card text',
  addCard: 'Add card',
  adding: 'Adding…',
  photoCards: 'Photo cards',
  cardsHeader: 'CARDS',
  saving: 'Saving…',
  saveDeck: 'Save deck',

  /** {index} is the card's position in the list, starting at 1. */
  card: {
    label: 'Card {index}',
    photoLabel: 'Photo on card {index}. Change or remove it.',
    tooLong: '{count} characters — small at arm’s length',
    tabooLabel: 'Banned words for card {index}',
    tabooPlaceholder: '🚫 Words the room can’t say, separated by commas',
    /** Small link under a card, keep short. */
    addPhoto: '+ Photo',
    addPhotoHint: 'Add a photo to card {index}',
    /** Small link under a card, keep short. */
    addTaboo: '+ Banned words',
    addTabooHint: 'Add banned words to card {index}',
    moveUp: 'Move card {index} up',
    moveDown: 'Move card {index} down',
    delete: 'Delete card {index}',
  },

  /** Editing a deck that came with the app: hide its cards, add your own. */
  free: {
    title: 'Make it yours',
    counts: '{showing} cards in play · {mine} yours · {hidden} hidden',
    intro: 'Hide cards you don’t want, add your own. Your changes stay when the app updates this deck.',
    addYourOwn: 'ADD YOUR OWN',
    newCardLabel: 'New card',
    cardsHeader: 'CARDS · TAP THE EYE TO HIDE ONE',
    search_one: 'Search {count} card',
    search_other: 'Search {count} cards',
    /** Tiny badge on a card the user added. */
    yoursBadge: 'YOURS',
    yourCardLabel: 'Your card',
    /** {text} is the card's text. */
    deleteCardLabel: 'Delete {text}',
    cardInPlayLabel: '{text}, in play',
    cardHiddenLabel: '{text}, hidden',
    resetLink: 'Reset to the original deck',
    reset: {
      title: 'Back to the original?',
      body: 'Every hidden card comes back and the cards you added are removed.',
      keepMine: 'Keep mine',
      confirm: 'Reset',
    },
    saveChanges: 'Save changes',
  },
} as const;
