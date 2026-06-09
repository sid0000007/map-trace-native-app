import { Stack, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { LocationDetailCard } from '../../src/domains/locations/components/location-detail-card';
import { ErrorView, LoadingView } from '../../src/domains/locations/components/status-view';
import { LocationNotFoundError } from '../../src/domains/locations/errors';
import { useLocation } from '../../src/domains/locations/hooks/use-location';
import { getErrorMessage } from '../../src/lib/http/error-message';

/**
 * Location Detail Screen: fetches a single location by route param and renders
 * it. Handles loading, not-found, and error+retry states, with pull-to-refresh.
 */
export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId = id ?? '';
  const { data, isPending, isError, error, refetch, isRefetching } = useLocation(locationId);

  const notFound = error instanceof LocationNotFoundError;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
    >
      <Stack.Screen options={{ title: data?.name ?? 'Location' }} />

      {isPending ? (
        <LoadingView label="Loading location…" />
      ) : notFound ? (
        <ErrorView message="We couldn't find that location." />
      ) : isError ? (
        <ErrorView message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : data ? (
        <LocationDetailCard location={data} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
  },
});
