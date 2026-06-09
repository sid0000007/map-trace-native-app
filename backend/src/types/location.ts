import { z } from 'zod';

/**
 * Server-side copy of the Location contract (mirrors the client's
 * `src/domains/locations/types/location.schema.ts`). The dataset is validated
 * against this schema at module load (see `data/locations.ts`), so the payload
 * can never drift from the contract the client parses.
 *
 * Coordinates are plain numbers here: semantic validity (in-range lat/lng) is a
 * client concern, so the dataset may intentionally include an out-of-range
 * fixture for the client's edge-case handling.
 */
export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string().optional(),
  address: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const locationsSchema = z.array(locationSchema);

export type Location = z.infer<typeof locationSchema>;
