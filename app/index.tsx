import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LocationMap } from '../src/domains/locations/components/location-map';
import { EmptyView, ErrorView, LoadingView } from '../src/domains/locations/components/status-view';
import { useLocations } from '../src/domains/locations/hooks/use-locations';
import { getErrorMessage } from '../src/lib/http/error-message';

/** Header action that re-fetches the locations list (the map's refresh affordance). */
function RefreshButton({ busy, onPress }: { busy: boolean; onPress: () => void }) {
  if (busy) {
    return <ActivityIndicator style={styles.headerAction} />;
  }
  return (
    <Pressable
      onPress={onPress}
      style={styles.headerAction}
      accessibilityRole="button"
      accessibilityLabel="Refresh locations"
    >
      <Text style={styles.headerActionText}>Refresh</Text>
    </Pressable>
  );
}

/**
 * Map Screen: renders a marker per (valid) location and routes to the detail
 * screen on tap. Handles loading, error+retry, and empty states. The map itself
 * cannot host a RefreshControl, so the refetch affordance is a header button.
 */
export default function MapScreen() {
  const { data, isPending, isError, error, refetch, isRefetching } = useLocations();

  const handleSelect = useCallback((id: string) => {
    router.push({ pathname: '/location/[id]', params: { id } });
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Locations',
          headerRight: () => <RefreshButton busy={isRefetching} onPress={() => refetch()} />,
        }}
      />

      {isPending ? (
        <LoadingView label="Loading locations…" />
      ) : isError ? (
        <ErrorView message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyView message="No locations to show yet." />
      ) : (
        <LocationMap locations={data} onSelect={handleSelect} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAction: {
    paddingHorizontal: 8,
  },
  headerActionText: {
    fontSize: 16,
    color: '#1f6feb',
    fontWeight: '600',
  },
});
