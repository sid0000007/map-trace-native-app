import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '../src/lib/query/query-provider';

/**
 * Root layout: installs app-wide providers (TanStack Query, safe-area) and the
 * Expo Router navigation stack. Screens are registered file-by-file under `app/`.
 */
export default function RootLayout() {
  return (
    <QueryProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Locations' }} />
          <Stack.Screen name="location/[id]" options={{ title: 'Location' }} />
        </Stack>
      </SafeAreaProvider>
    </QueryProvider>
  );
}
