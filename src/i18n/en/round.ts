/** The round itself: intro countdown, play, recap and standings. */
export const round = {
  /** Used on more than one round screen. */
  shared: {
    /** stat tile label under a number, lowercase, keep short */
    gotIt: "got it",
    /** stat tile label under a number, lowercase, keep short */
    points: "points",
    /** stat tile label under a number, lowercase, keep short */
    roundsLabel_one: "round",
    roundsLabel_other: "rounds",
    reshuffled: "The decks ran out and got reshuffled.",
  },

  intro: {
    /** big headline on the team-coloured screen; {name} is the player who holds the phone next */
    youreUp: "{name}, you’re up",
    /** big headline when players have no names */
    phoneOnForehead: "Phone on your forehead",
    hintTilt: "Tip down if you got it, up to pass",
    hintSwipe: "Swipe up if you got it, down to pass",
    hintTap: "Tap the top if you got it, the bottom to pass",
    /** screen reader label; {who} is the headline above, {count} the 3-2-1 countdown number */
    countdownA11y: "{who}. Starting in {count}. Tap to start now.",
    tapWhenReady: "Tap when you’re ready",
    /** screen reader label for the rule announcement before a round */
    noticeA11y: "{overline}. {title}. {rule}. Tap when ready.",
    /** overline pill, all caps; three-round mode */
    phaseOverline: "PHASE {phase} OF 3",
    /** overline pill, all caps; a random twist applies to this round */
    chaosOverline: "🌀 CHAOS ROUND",
    /** overline pill, all caps; taboo mode */
    bannedOverline: "BANNED WORDS",
    bannedTitle: "Don’t say the words",
    bannedRule:
      "The room can’t say anything listed under the card. Slip up and it’s busted: the card’s gone and it costs a point.",
  },

  play: {
    /** screen reader label for the whole paused screen */
    pausedA11y_one: "Paused. {count} second left. Tap to carry on.",
    pausedA11y_other: "Paused. {count} seconds left. Tap to carry on.",
    pausedTitle: "Paused",
    pausedBody_one: "{count} second left. Tap anywhere to carry on.",
    pausedBody_other: "{count} seconds left. Tap anywhere to carry on.",
    /** button, keep short */
    endRound: "End round",
    /** button, keep short */
    quitGame: "Quit game",
    quitGameHint: "Saved rounds are kept",
    /** small pill shown to the room during three-round mode; {title} is the phase name, {count} cards still in the hat */
    phaseBadge_one: "{emoji} {title} · {count} left",
    phaseBadge_other: "{emoji} {title} · {count} left",
    /** icon button label for screen readers */
    pause: "Pause",
    /** screen reader label for the top half of the screen (the card was guessed) */
    gotIt: "Got it",
    /** screen reader label for the bottom half of the screen (skip the card) */
    pass: "Pass",
    swipeA11y: "Swipe up for got it, down to pass",
    /** huge text when every card in the hat has been guessed; keep very short */
    hatEmpty: "Hat’s empty!",
    /** huge text when the timer runs out; keep very short */
    timesUp: "Time’s up!",
  },

  recap: {
    /** button while the round is being saved */
    saving: "Saving…",
    /** button */
    continue: "Continue",
    /** stat tile label under the number of passed cards, lowercase */
    passesLabel_one: "pass",
    passesLabel_other: "passes",
    /** {title} is the twist name */
    twistDouble: "{emoji} {title}: every card counted twice.",
    twistPlain: "{emoji} {title}.",
    clearedGameOver: "🎩 That cleared the hat. Game over!",
    clearedPhase: "🎩 That cleared the hat for this phase.",
    /** section overline above the list of cards, all caps */
    listLabelFix: "TAP ONE TO FIX A MIS-TAP",
    /** section overline above an empty list, all caps */
    listLabelEmpty: "THIS ROUND",
    emptyTitle: "Nothing this round",
    emptyBody: "The timer beat everyone to it. Next time.",
    /** stand-in when a card's text can't be found */
    cardFallback: "Card",
    /** screen reader labels for a card row; {card} is the card text */
    rowA11yGot: "{card}, got it. Tap to change to passed.",
    rowA11yBusted: "{card}, busted on {word}. Tap to change to got it.",
    rowA11yPassed: "{card}, passed. Tap to change to got it.",
    statusGot: "Got it",
    /** {word} is the banned word someone said */
    statusBusted: "Busted: “{word}”",
    statusPassed: "Passed",
    /** big headline after the round, by how many cards were guessed */
    verdict: {
      unreal: "Unreal 🔥",
      great: "Great round",
      nice: "Nice one",
      onTheBoard: "On the board",
      rough: "Rough one",
    },
  },

  standings: {
    noGameTitle: "No game in progress",
    noGameBody: "Start a new one from the home screen.",
    /** button, keep short */
    home: "Home",
    restartTitle: "Start over?",
    restartMessage: "Scores go back to zero. Same players, same decks.",
    /** alert button that cancels starting over */
    keepGoing: "Keep going",
    /** button, keep short */
    startOver: "Start over",
    /** big headline when everyone played as one team and the game ended */
    headlineSolo: "GG 🎉",
    /** big headline; {team} is the winning team's name */
    headlineWinner: "{team} win 👑",
    headlineTie: "It’s a tie 🤝",
    headlineStandings: "Standings",
    /** chat bubble at the end of a one-team game */
    bubbleSolo_one: "{count} point between you. Run it back?",
    bubbleSolo_other: "{count} points between you. Run it back?",
    bubbleClose: "That was close. Rematch?",
    bubbleNotClose: "Not even close. Rematch?",
    /** {teams} is a list of tied team names joined with teamListJoiner */
    bubbleTie: "{teams} are level. Settle it?",
    /** goes between tied team names, with spaces, e.g. "Red and Blue and Green" */
    teamListJoiner: " and ",
    bubbleNextPlayer: "{name}, you’re up next.",
    bubbleRoundsDown_one: "{count} round down. Keep it going.",
    bubbleRoundsDown_other: "{count} rounds down. Keep it going.",
    /** overline, all caps; {title} is the phase name, already uppercased */
    hatOverline: "PHASE {phase} OF 3 · {title}",
    /** {count} is the total number of cards in the hat */
    hatLeft_one: "{remaining} of {count} card left in the hat",
    hatLeft_other: "{remaining} of {count} cards left in the hat",
    /** overline, all caps; {name} is the losing team or player, already uppercased */
    forfeitOverline: "😈 FORFEIT FOR {name}",
    /** small button; {seconds} is the round length */
    nextRoundSeconds: "Next round: {seconds}s",
    nextRoundSecondsHint: "Tap to cycle 30, 60 and 90 seconds",
    teams: "Teams",
    /** parts of the stat line under a team or player, joined with " · " */
    statGot: "{count} got",
    statPasses_one: "{count} pass",
    statPasses_other: "{count} passes",
    statRounds_one: "{count} round",
    statRounds_other: "{count} rounds",
    /** section label when everyone played as one team */
    scores: "Scores",
    byPlayer: "By player",
    /** button while the rematch is being set up */
    starting: "Starting…",
    /** button: rematch with the same players and decks */
    runItBack: "Run it back",
    /** button opening the end-of-game summary to share, keep short */
    wrapped: "Wrapped",
    /** button; {name} is the next player */
    nextUp: "Next up: {name}",
    nextRound: "Next round",
    /** button, keep short */
    changeDecks: "Change decks",
    /** button, very short (landscape footer) */
    decks: "Decks",
    finishLater: "Finish later",
    finishLaterHint: "Your game is saved",
  },
} as const;
