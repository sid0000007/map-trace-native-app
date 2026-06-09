import { locationSchema, locationsSchema } from '../../src/domains/locations/types/location.schema';

const valid = {
  id: 'par-eiffel',
  name: 'Eiffel Tower',
  description: 'Iron lattice tower.',
  latitude: 48.8584,
  longitude: 2.2945,
};

describe('locationSchema', () => {
  it('accepts a valid location with only required fields', () => {
    expect(locationSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts the optional fields when present', () => {
    const result = locationSchema.safeParse({
      ...valid,
      category: 'landmark',
      address: 'Champ de Mars',
      imageUrl: 'https://example.com/x.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a payload missing a required field', () => {
    const result = locationSchema.safeParse({
      id: 'x',
      description: 'no name',
      latitude: 1,
      longitude: 2,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a field of the wrong type', () => {
    const result = locationSchema.safeParse({ ...valid, latitude: '48.8' });
    expect(result.success).toBe(false);
  });
});

describe('locationsSchema', () => {
  it('parses an array of locations', () => {
    expect(locationsSchema.safeParse([valid]).success).toBe(true);
  });

  it('rejects a non-array payload', () => {
    expect(locationsSchema.safeParse(valid).success).toBe(false);
  });
});
