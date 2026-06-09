import { StyleSheet, Text, View } from 'react-native';

/**
 * Map Screen (placeholder). Phase 3 replaces this with a react-native-maps view
 * rendering location markers fetched through the locations service.
 */
export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>Location markers arrive in Phase 3.</Text>
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
