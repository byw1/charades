import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MIN_PLAYABLE_CARDS, summaryIsPlayable, type DeckSummary } from '@/decks/types';
import { useDatabase } from '@/hooks/useDatabase';
import { withDecks } from '@/game/session';
import { useNewGameStore } from '@/hooks/useNewGameStore';
import { t } from '@/i18n';
import { useSessionStore } from '@/hooks/useSessionStore';
import { getDeck, listDeckSummaries } from '@/storage/deckRepo';
import { saveSession } from '@/storage/sessionRepo';
import { Loader } from '@/ui/Loader';
import { Button } from '@/ui/Button';
import { EmptyState } from '@/ui/EmptyState';
import { Icon } from '@/ui/Icon';
import { Footer, Screen } from '@/ui/Screen';
import { Avatar } from '@/ui/Social';
import { StepHeader } from '@/ui/StepHeader';
import { Tap } from '@/ui/Tap';
import { Text } from '@/ui/Text';
import { color, gutter, space } from '@/ui/tokens';

/**
 * Step one of three: which decks are in play. Pick as many as you like.
 *
 * Also used part way through a game (`?change=1`) to swap decks without
 * losing the score: it starts from the game's decks and puts the new ones
 * straight into play.
 */
export default function NewGameDecksScreen() {
  const router = useRouter();
  const database = useDatabase();
  const { change } = useLocalSearchParams<{ change?: string }>();
  const changing = change === '1';

  const draftIds = useNewGameStore((s) => s.deckIds);
  const toggleDraft = useNewGameStore((s) => s.toggleDeck);
  const session = useSessionStore((s) => s.session);
  const resumeSession = useSessionStore((s) => s.resumeSession);
  const [picked, setPicked] = useState<string[]>(() => (changing ? [...(session?.deckIds ?? [])] : []));
  const [applying, setApplying] = useState(false);

  const deckIds = changing ? picked : draftIds;
  const toggleDeck = (id: string) => {
    if (!changing) return toggleDraft(id);
    setPicked((current) => (current.includes(id) ? current.filter((d) => d !== id) : [...current, id]));
  };

  /** Puts the new decks into the game in progress and goes back to it. */
  const applyChange = async () => {
    if (!session || database.status !== 'ready' || applying) return;
    setApplying(true);
    try {
      const loaded = await Promise.all(picked.map((id) => getDeck(database.db, id)));
      const decks = loaded.flatMap((deck) =>
        deck ? [{ id: deck.id, name: deck.name, accentColor: deck.accentColor, cards: deck.cards }] : [],
      );
      const next = withDecks(session, decks.map((deck) => deck.id));
      resumeSession(next, decks, Date.now() >>> 0);
      await saveSession(database.db, next);
      router.back();
    } finally {
      setApplying(false);
    }
  };

  const [decks, setDecks] = useState<DeckSummary[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (database.status !== 'ready') return;

      let cancelled = false;
      const { db } = database;

      void (async () => {
        const all = await listDeckSummaries(db);
        if (!cancelled) setDecks(all);
      })();

      return () => {
        cancelled = true;
      };
    }, [database]),
  );

  const chosen = (decks ?? []).filter((d) => deckIds.includes(d.id));
  const totalCards = chosen.reduce((sum, d) => sum + d.cardCount, 0);
  const enough = totalCards >= MIN_PLAYABLE_CARDS;

  const header = (
    <StepHeader
      step={1}
      of={changing ? 1 : 3}
      title={changing ? t('newGame.decks.changeTitle') : t('newGame.decks.title')}
      subtitle={changing ? t('newGame.decks.changeSubtitle') : t('newGame.decks.subtitle')}
      onClose={router.back}
    />
  );

  if (database.status === 'error') {
    return (
      <Screen>
        {header}
        <EmptyState title={t('newGame.decks.openError')} body={database.message} mood="sad" />
      </Screen>
    );
  }

  if (!decks) {
    return (
      <Screen>
        {header}
        <Loader />
      </Screen>
    );
  }

  return (
    <Screen>
      {header}

      <FlatList
        data={decks}
        keyExtractor={(deck) => deck.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const selected = deckIds.includes(item.id);
          const playable = summaryIsPlayable(item);

          return (
            <Tap
              onPress={() => toggleDeck(item.id)}
              disabled={!playable}
              squish={0.98}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected, disabled: !playable }}
              accessibilityLabel={t('newGame.decks.rowA11y', { name: item.name, count: item.cardCount })}
              contentStyle={[styles.row, !playable && styles.disabled]}
            >
              <Avatar name={item.name} tint={item.accentColor} size={46} />
              <View style={styles.rowBody}>
                <Text variant="heading" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text variant="caption" tone="muted">
                  {playable
                    ? t('newGame.decks.cardCount', { count: item.cardCount })
                    : t('newGame.decks.cardCountTooFew', { count: item.cardCount })}
                </Text>
              </View>
              <View style={[styles.check, selected && styles.checkOn]}>
                {selected ? <Icon name="check" size={16} color={color.ink} weight={3.5} /> : null}
              </View>
            </Tap>
          );
        }}
        ListEmptyComponent={<EmptyState title={t('newGame.decks.emptyTitle')} body={t('newGame.decks.emptyBody')} mood="sad" />}
      />

      <Footer>
        {chosen.length > 0 ? (
          <Text variant="caption" tone="muted" numberOfLines={1} align="center">
            {chosen.map((d) => d.name).join(t('newGame.decks.listSeparator'))}
          </Text>
        ) : null}
        <Button
          label={
            deckIds.length === 0
              ? t('newGame.decks.pickAtLeastOne')
              : !enough
                ? t('newGame.decks.cardsNeeded', { count: MIN_PLAYABLE_CARDS })
                : changing
                  ? t('newGame.decks.playThese', { count: totalCards })
                  : t('newGame.decks.next', { count: totalCards })
          }
          variant="blue"
          size="lg"
          icon={enough ? (changing ? 'check' : 'forward') : undefined}
          disabled={!enough || applying}
          onPress={() => (changing ? void applyChange() : router.push('/new/teams'))}
        />
      </Footer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: space.md, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md - 4,
    paddingHorizontal: gutter,
    paddingVertical: 10,
  },
  rowBody: { flex: 1, gap: 1 },
  disabled: { opacity: 0.4 },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: color.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: color.focus, borderColor: color.focus },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
