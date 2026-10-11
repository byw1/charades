import type { SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { removeLeftovers } from '@/media/leftovers';
import { t } from '@/i18n';
import { openDatabase } from '@/storage/database';
import { MigrationError } from '@/storage/migrations';
import { seedBundledDecks } from '@/storage/seed';

/**
 * Opens the database, migrates it and installs the bundled decks.
 *
 * One place owns startup so a screen never has to wonder whether the decks are
 * there yet.
 */

export type DatabaseState =
  | { status: 'loading' }
  | { status: 'ready'; db: SQLiteDatabase }
  | { status: 'error'; message: string };

let startup: Promise<SQLiteDatabase> | null = null;

/**
 * Open, migrate and seed, once per app launch, shared by every caller.
 *
 * Seeding has to be shared as well as the open. Every screen asks for the
 * database, and two asking in the same frame — Home and the start-game hook
 * do — would otherwise run two seeds at once on one connection: overlapping
 * transactions and duplicate inserts. A failed startup is not cached, so a
 * transient failure can be retried by the next screen that asks.
 */
function start(): Promise<SQLiteDatabase> {
  startup ??= (async () => {
    const db = await openDatabase();
    const report = await seedBundledDecks(db);
    removeLeftovers();

    if (report.rejected.length > 0) {
      // A build problem rather than a user problem, and the app still works
      // with whatever installed. Loud in development, silent in production
      // because there is nothing the user could do about it.
      if (__DEV__) {
        console.warn('Bundled decks failed validation:', report.rejected);
      }
    }

    return db;
  })().catch((error: unknown) => {
    startup = null;
    throw error;
  });

  return startup;
}

export function useDatabase(): DatabaseState {
  const [state, setState] = useState<DatabaseState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const db = await start();
        if (!cancelled) setState({ status: 'ready', db });
      } catch (error) {
        if (cancelled) return;
        setState({
          status: 'error',
          message: startupErrorMessage(error),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** The startup failure in words for the screen, in the phone's language. */
function startupErrorMessage(error: unknown): string {
  if (error instanceof MigrationError) {
    const { failure } = error;
    if (failure.kind === 'tooNew') return t('ui.database.tooNew', { current: failure.current, latest: failure.latest });
    if (failure.kind === 'stepFailed') return t('ui.database.migrationFailed', { step: failure.step, name: failure.name });
  }
  // Anything else is a raw system error with no translation; it is still
  // more useful to whoever reports it than a generic line.
  return error instanceof Error ? error.message : t('ui.database.openFailed');
}
