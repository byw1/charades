/** App settings screen. */
export const settings = {
  title: 'Settings',
  close: 'Close settings',

  switchTheme: {
    title: 'Switch the look?',
    message: 'The app restarts for a second to repaint. Your game, decks and settings are all kept.',
    cancel: 'Not now',
    confirm: 'Switch',
  },

  reset: {
    title: 'Reset settings?',
    message: 'Your preferences go back to their defaults. Your decks, games, videos and streak are not touched.',
    cancel: 'Keep',
    confirm: 'Reset',
  },

  answer: {
    heading: 'How you answer',
    // e.g. "Tilt to answer"
    accessibilityLabel: '{mode} to answer',
    // Each mode: a one-word label, a short detail under it, and a longer note.
    tilt: {
      label: 'Tilt',
      detail: 'Tip down got it, up pass',
      note: 'Tilt replaces tap for the whole round, so a hand resting on the screen can’t answer for you. If the motion sensor doesn’t respond, tap takes over by itself.',
    },
    swipe: {
      label: 'Swipe',
      detail: 'Up got it, down pass',
      note: 'Swipe anywhere on the screen: up for got it, down to pass. No aiming, and a resting hand won’t count.',
    },
    tap: {
      label: 'Tap',
      detail: 'Top got it, bottom pass',
      note: 'The top half of the screen is got it, the bottom half is pass.',
    },
  },

  look: {
    heading: 'Look',
    // e.g. "Dark theme"
    accessibilityLabel: '{theme} theme',
    dark: 'Dark',
    light: 'Light',
    // Follows the phone's own light/dark setting.
    system: 'Auto',
    note: 'Light is easier to see outside in the sun. Auto follows your phone. Switching restarts the app for a second; nothing is lost.',
  },

  feel: {
    heading: 'Sound and feel',
    sound: 'Sound effects',
    soundDetail: 'A ding for got it, a whoosh for a pass, the countdown and the buzzer.',
    haptics: 'Haptics',
    hapticsDetail: 'Buzzes tell the holder what happened.',
    brightness: 'Max brightness',
    brightnessDetail: 'So the card reads in a dark room.',
  },

  more: {
    heading: 'More',
    howToPlay: 'How to play',
    reset: 'Reset settings',
  },

  // App name and version number, e.g. "Charades 1.2.0".
  version: '{appName} {version}',
  privacy: 'Works offline. No accounts, no ads, no tracking.\nNothing you make leaves your phone unless you share it.',
} as const;
