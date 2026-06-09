import { StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import type { Location } from '../types/location.schema';

/**
 * Computes a map region that frames all given locations, with a little padding.
 * Returns `undefined` for an empty list (the map then shows its default region).
 * Callers pass only coordinate-valid locations (the service filters the rest).
 */
function computeRegion(locations: Location[]): Region | undefined {
  if (locations.length === 0) {
    return undefined;
  }

  const latitudes = locations.map((location) => location.latitude);
  const longitudes = locations.map((location) => location.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latitudeDelta = Math.max((maxLat - minLat) * 1.3, 0.05);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.3, 0.05);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}

interface LocationMapProps {
  locations: Location[];
  onSelect: (id: string) => void;
}

/** Presentational map: renders one marker per location and reports taps. */
export function LocationMap({ locations, onSelect }: LocationMapProps) {
  return (
    <MapView style={styles.map} initialRegion={computeRegion(locations)}>
      {locations.map((location) => (
        <Marker
          key={location.id}
          identifier={location.id}
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={location.name}
          description={location.category}
          onPress={() => onSelect(location.id)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
