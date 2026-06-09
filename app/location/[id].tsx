import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Location Detail Screen (placeholder). Phase 3 fetches the location by id and
 * renders its details. The route param is read here to prove navigation wiring.
 */
export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Detail</Text>
      <Text style={styles.subtitle}>id: {id}</Text>
      <Text style={styles.subtitle}>Details arrive in Phase 3.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
