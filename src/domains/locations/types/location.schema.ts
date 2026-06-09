import { z } from 'zod';

/**
 * The Location domain model — the single shared contract between the Cloudflare
 * Worker (Phase 2) and the client (Phase 3). Zod is the one parse boundary:
 * raw API payloads are validated here, in the repository layer, and nowhere else.
 *
 * Note on coordinates: latitude/longitude are accepted as plain numbers at the
 * parse boundary. Filtering of out-of-range / invalid coordinates is a business
 * concern handled by LocationService — so a single bad row never rejects the
 * whole list. See `isValidCoordinate` (added in Phase 3).
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

/** Error response shape for the API: `{ error: string }`. */
export const apiErrorSchema = z.object({
  error: z.string(),
});

export type Location = z.infer<typeof locationSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
