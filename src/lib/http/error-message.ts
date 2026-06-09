import { HttpError, NetworkError, TimeoutError } from './errors';

/**
 * Maps an unknown thrown value onto a short, user-facing message. Centralised so
 * every screen surfaces consistent copy for the same failure modes.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof TimeoutError) {
    return 'The request timed out. Check your connection and try again.';
  }
  if (error instanceof NetworkError) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  if (error instanceof HttpError) {
    return `The server responded with an error (${error.status}). Please try again.`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
