/**
 * Game data shown during play: twists, three-round phases, forfeits and
 * default team names. The English must match src/game exactly
 * (src/i18n/gameText.test.ts checks it); the UI reads these through
 * src/i18n/gameText.ts.
 */
export const game = {
  /**
   * Chaos twists: a random rule announced before a round. The clue-givers
   * follow it; the guesser has the phone on their forehead. Titles are short
   * headlines, rules one or two short sentences.
   */
  twists: {
    accents: {
      title: 'Accents only',
      rule: 'Every clue in an accent. Pick one and commit.',
    },
    whisper: {
      title: 'Whisper round',
      rule: 'Clue-givers can only whisper.',
    },
    noHands: {
      title: 'No hands',
      rule: 'Hands behind your backs. Words only.',
    },
    hum: {
      title: 'Hum it',
      rule: 'No words. Hum, beatbox or make noises.',
    },
    slowMo: {
      title: 'Slow motion',
      rule: 'Every clue, every move, in slow motion.',
    },
    robot: {
      title: 'Robot voice',
      rule: 'Clue-givers talk like robots. Beep boop.',
    },
    sing: {
      title: 'Sing it',
      rule: 'Every clue has to be sung.',
    },
    caveman: {
      title: 'Caveman',
      rule: 'Grunts and pointing. No real words.',
    },
    freeze: {
      title: 'Freeze',
      rule: 'Clue-givers can’t move. Voices only.',
    },
    opposite: {
      title: 'Opposite day',
      rule: 'Describe it only by saying what it isn’t.',
    },
    oneVoice: {
      title: 'One voice',
      rule: 'Only one clue-giver at a time. Take turns.',
    },
    double: {
      title: 'Double points',
      rule: 'Every card you get is worth two.',
    },
    speed: {
      title: 'Speed round',
      rule: 'Half the time. Go, go, go.',
    },
  },
  /**
   * Three-round mode: the same hat of cards played three times, with a
   * stricter rule each phase (p1 = anything goes, p2 = one word, p3 = mime).
   */
  phases: {
    p1: {
      title: 'Say anything',
      rule: 'Describe it any way you like. Remember the cards: they come back.',
    },
    p2: {
      title: 'One word',
      rule: 'One word per card. That’s it. Make it count.',
    },
    p3: {
      title: 'Act it out',
      rule: 'No words, no sounds. Pure charades.',
    },
  },
  /**
   * Forfeits: a light dare for the player or team that came last, done in the
   * room. Keep them family-friendly (no drinking). "The winners" are the
   * players who beat them.
   */
  forfeits: {
    f01: 'Do your best impression of someone in the room until they guess who it is.',
    f02: 'Talk in an accent until the next game starts.',
    f03: 'Narrate the next two minutes like a nature documentary.',
    f04: 'Serenade the winners with a song they choose.',
    f05: 'Do a dramatic slow-motion replay of your worst card.',
    f06: 'Give every winner a sincere, specific compliment.',
    f07: 'Talk like a pirate until your next turn.',
    f08: 'Do ten jumping jacks while singing the alphabet.',
    f09: 'Freestyle rap about the winners for thirty seconds.',
    f10: 'Strike a model pose every time someone says your name for ten minutes.',
    f11: 'Be the winners’ hype crew: cheer every time one of them speaks, for five minutes.',
    f12: 'Do your best runway walk across the room.',
    f13: 'Speak only in questions until the next round starts.',
    f14: 'Act out a film of the winners’ choosing. No words.',
    f15: 'Do your best evil villain laugh. Then do it louder.',
    f16: 'Explain the rules of this game like a sports commentator.',
    f17: 'Talk about yourself in the third person for ten minutes.',
    f18: 'Invent a secret handshake with the winners and do it.',
    f19: 'Perform a twenty-second interpretive dance called “Losing”.',
    f20: 'Give a victory speech on behalf of the team that beat you.',
    f21: 'Sing your next sentence like an opera singer.',
    f22: 'Let the winners choose the next deck.',
    f23: 'Tell a terrible joke. Keep going until someone groans.',
    f24: 'Draw a portrait of a winner with your other hand.',
    f25: 'Hold a plank while the winners slowly count to twenty.',
    f26: 'Do a celebrity impression the winners pick.',
    f27: 'Moonwalk across the room. Commit to it.',
    f28: 'Announce the next round like a boxing ring MC.',
    f29: 'Speak in rhymes until your next turn.',
    f30: 'Pick a winner and be their butler until the next game starts.',
  },
  /** Badges on the Me page. Titles are short labels under an emoji; hints say how to earn one. */
  badges: {
    first: { title: 'First game', hint: 'Finish a round' },
    ten: { title: 'Big brain', hint: '10 in one round' },
    streak3: { title: 'On a roll', hint: '3-day streak' },
    hundred: { title: 'Hundred club', hint: '100 cards guessed' },
    regular: { title: 'Party regular', hint: 'Play 10 games' },
  },
  teams: {
    /** Default team names, each matching its colour (red, blue, yellow, purple, green, orange). Players can rename them. */
    defaults: {
      t1: 'Reds',
      t2: 'Blues',
      t3: 'Yellows',
      t4: 'Purples',
      t5: 'Greens',
      t6: 'Oranges',
    },
    /** The single team in "just play" mode, when the group plays without teams. */
    everyone: 'Everyone',
  },
} as const;
