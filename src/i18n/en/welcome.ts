/** How to play: the story-style intro shown on first launch. */
export const welcome = {
  stories: {
    forehead: {
      caption: 'Put the phone on your forehead',
      detail: 'A word pops up. Everyone can see it except you.',
    },
    clues: {
      caption: 'Your friends yell clues',
      detail: 'Act it out, hum it, describe it. Just don’t say it.',
      // Stickers of friends shouting clues for the word "dog". Keep short and silly.
      stickerBarks: 'it barks!!',
      stickerFetch: 'FETCH',
      stickerGoodBoy: 'good boy 🐶',
    },
  },
  // The last story, teaching the controls the phone is set to.
  controls: {
    tilt: {
      caption: 'Tip it down if you got it',
      detail: 'Tip it up to pass. Most cards before time’s up wins.',
    },
    swipe: {
      caption: 'Swipe up if you got it',
      detail: 'Swipe down to pass, anywhere on the screen. Most cards before time’s up wins.',
    },
    tap: {
      caption: 'Tap top if you got it',
      detail: 'Tap the bottom to pass. Most cards before time’s up wins.',
    },
  },
  previous: 'Previous',
  // The mascot's name, shown like the sender of a story. Usually left as is.
  mascotName: 'Dex',
  // Next to the mascot's name, where a story app shows the time posted. Lower case.
  subtitle: 'how to play',
  skip: 'Skip',
  // Button, keep short.
  letsPlay: 'Let’s play',
  tapToContinue: 'Tap to continue',
} as const;
