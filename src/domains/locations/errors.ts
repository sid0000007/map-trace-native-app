/**
 * Domain error raised when a location id does not exist. Keeps the UI decoupled
 * from the HTTP layer: the repository translates an HTTP 404 into this, so screens
 * can branch on a domain concept ("not found") rather than a status code.
 */
export class LocationNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`Location not found: ${id}`);
    this.name = 'LocationNotFoundError';
  }
}
