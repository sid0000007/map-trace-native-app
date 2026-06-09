import type { Location } from '../types/location.schema';

/**
 * Returns true if the coordinates are finite and within valid geographic ranges
 * (latitude −90..90, longitude −180..180). This is the rule used to keep
 * unrenderable / corrupt rows off the map.
 */
export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/** Convenience predicate over a Location. */
export function hasValidCoordinates(location: Location): boolean {
  return isValidCoordinate(location.latitude, location.longitude);
}
