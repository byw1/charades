import { Stack } from 'expo-router';
import { getLocales } from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from '@/hooks/useAppFonts';
import { initLocale } from '@/i18n';
import { color, scheme } from '@/ui/tokens';

// Held until the typefaces are ready, so the first frame anyone sees is the
// real one rather than a flash of system text.
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

// The phone's language, settled before anything renders. Every translation
// is bundled, so this is a lookup, not a download.
try {
  initLocale(getLocales());
} catch {
  // No locale information: stay in English.
}

// Native pieces — the keyboard, alerts, pickers — follow the app's theme
// rather than the phone's.
try {
  Appearance.setColorScheme(scheme);
} catch {
  // Older platforms without the override keep the phone's appearance.
}

export default function RootLayout() {
  const fontsReady = useAppFonts();

  // Deck links and .charades files are routed to the import preview by
  // app/+native-intent.tsx, so neither can install a deck silently.

  useEffect(() => {
    if (fontsReady) void SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="welcome" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="wrapped" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="round" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
