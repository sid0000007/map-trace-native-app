import { getErrorMessage } from '../../src/lib/http/error-message';
import { HttpError, NetworkError, TimeoutError } from '../../src/lib/http/errors';

describe('getErrorMessage', () => {
  it('describes a timeout', () => {
    expect(getErrorMessage(new TimeoutError('t'))).toMatch(/timed out/i);
  });

  it('describes a network failure', () => {
    expect(getErrorMessage(new NetworkError('n'))).toMatch(/reach the server/i);
  });

  it('includes the status for an HTTP error', () => {
    expect(getErrorMessage(new HttpError('h', 503))).toMatch(/503/);
  });

  it('falls back to a generic Error message', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('handles a non-Error value', () => {
    expect(getErrorMessage('weird')).toMatch(/something went wrong/i);
  });
});
