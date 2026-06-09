import { Image, StyleSheet, Text, View } from 'react-native';
import type { Location } from '../types/location.schema';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/** Presentational detail view for a single location. */
export function LocationDetailCard({ location }: { location: Location }) {
  return (
    <View style={styles.container}>
      {location.imageUrl ? (
        <Image
          source={{ uri: location.imageUrl }}
          style={styles.image}
          accessibilityLabel={location.name}
        />
      ) : null}

      <Text style={styles.name}>{location.name}</Text>
      {location.category ? <Text style={styles.category}>{location.category}</Text> : null}
      <Text style={styles.description}>{location.description}</Text>

      <View style={styles.rows}>
        {location.address ? <DetailRow label="Address" value={location.address} /> : null}
        <DetailRow
          label="Coordinates"
          value={`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  category: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    color: '#1f6feb',
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  rows: {
    marginTop: 4,
    gap: 8,
  },
  row: {
    gap: 2,
  },
  rowLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  rowValue: {
    fontSize: 15,
    color: '#222',
  },
});
