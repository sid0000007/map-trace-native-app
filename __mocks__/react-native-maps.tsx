import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

/**
 * Test mock for `react-native-maps`. The native map can't render under Jest, so
 * MapView becomes a plain container and each Marker a pressable stub keyed by its
 * identifier — enough to assert markers render and that taps fire `onPress`.
 */

interface MapViewProps {
  children?: ReactNode;
}

export default function MapView({ children }: MapViewProps) {
  return <View testID="map-view">{children}</View>;
}

interface MarkerProps {
  identifier?: string;
  title?: string;
  onPress?: () => void;
}

export function Marker({ identifier, title, onPress }: MarkerProps) {
  return (
    <Pressable testID={`marker-${identifier ?? 'unknown'}`} accessibilityLabel={title} onPress={onPress} />
  );
}
