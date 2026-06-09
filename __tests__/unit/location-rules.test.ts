import {
  hasValidCoordinates,
  isValidCoordinate,
} from '../../src/domains/locations/services/location-rules';

describe('isValidCoordinate', () => {
  it('accepts in-range coordinates', () => {
    expect(isValidCoordinate(37.8199, -122.4783)).toBe(true);
  });

  it('accepts the exact boundary values', () => {
    expect(isValidCoordinate(90, 180)).toBe(true);
    expect(isValidCoordinate(-90, -180)).toBe(true);
  });

  it('rejects out-of-range latitude', () => {
    expect(isValidCoordinate(91, 0)).toBe(false);
    expect(isValidCoordinate(-90.1, 0)).toBe(false);
  });

  it('rejects out-of-range longitude', () => {
    expect(isValidCoordinate(0, 181)).toBe(false);
    expect(isValidCoordinate(0, -181)).toBe(false);
  });

  it('rejects non-finite numbers', () => {
    expect(isValidCoordinate(Number.NaN, 0)).toBe(false);
    expect(isValidCoordinate(0, Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe('hasValidCoordinates', () => {
  it('reads the coordinates off a location', () => {
    expect(
      hasValidCoordinates({ id: 'a', name: 'A', description: 'd', latitude: 1, longitude: 2 }),
    ).toBe(true);
    expect(
      hasValidCoordinates({ id: 'b', name: 'B', description: 'd', latitude: 999, longitude: -512 }),
    ).toBe(false);
  });
});
