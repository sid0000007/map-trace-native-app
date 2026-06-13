import { memo, useMemo } from 'react';
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

interface LocationMarkerProps {
  location: Location;
  onSelect: (id: string) => void;
}

/**
 * Memoized marker. `tracksViewChanges={false}` stops react-native-maps from
 * continuously re-rendering the marker view, and `memo` keeps markers from
 * rebuilding when the parent re-renders (e.g. on refetch) as long as `onSelect`
 * is stable.
 */
const LocationMarker = memo(function LocationMarker({ location, onSelect }: LocationMarkerProps) {
  return (
    <Marker
      identifier={location.id}
      coordinate={{ latitude: location.latitude, longitude: location.longitude }}
      title={location.name}
      description={location.category}
      tracksViewChanges={false}
      onPress={() => onSelect(location.id)}
    />
  );
});

interface LocationMapProps {
  locations: Location[];
  onSelect: (id: string) => void;
}

/** Presentational map: renders one marker per location and reports taps. */
export function LocationMap({ locations, onSelect }: LocationMapProps) {
  const region = useMemo(() => computeRegion(locations), [locations]);

  return (
    <MapView style={styles.map} initialRegion={region}>
      {locations.map((location) => (
        <LocationMarker key={location.id} location={location} onSelect={onSelect} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
