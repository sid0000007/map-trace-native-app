import { z } from 'zod';

/**
 * Location contract — the same shape served by the Cloudflare Worker and parsed
 * by the mobile app. Zod validates raw API payloads at the repository boundary.
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
