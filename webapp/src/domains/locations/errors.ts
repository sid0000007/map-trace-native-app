/** Raised when a location id does not exist (HTTP 404), kept as a domain concept. */
export class LocationNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`Location not found: ${id}`);
    this.name = 'LocationNotFoundError';
  }
}
