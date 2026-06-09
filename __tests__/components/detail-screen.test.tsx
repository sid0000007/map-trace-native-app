import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import { RefreshControl } from 'react-native';
import LocationDetailScreen from '../../app/location/[id]';
import { LocationNotFoundError } from '../../src/domains/locations/errors';
import { locationService } from '../../src/lib/config/locations';
import { NetworkError } from '../../src/lib/http/errors';
import { renderWithClient } from '../test-utils';

jest.mock('../../src/lib/config/locations', () => ({
  locationService: { getLocations: jest.fn(), getLocation: jest.fn() },
}));

const eiffel = {
  id: 'par-eiffel',
  name: 'Eiffel Tower',
  description: 'Iron lattice tower.',
  latitude: 48.8584,
  longitude: 2.2945,
  category: 'landmark',
  address: 'Champ de Mars, Paris',
};

const getLocation = jest.mocked(locationService.getLocation);
const params = jest.mocked(useLocalSearchParams);

beforeEach(() => {
  jest.clearAllMocks();
  params.mockReturnValue({ id: 'par-eiffel' });
});

describe('LocationDetailScreen', () => {
  it('shows loading, then renders the location fields [edge case 7]', async () => {
    getLocation.mockResolvedValue(eiffel);
    renderWithClient(<LocationDetailScreen />);

    expect(screen.getByText('Loading location…')).toBeTruthy();
    expect(await screen.findByText('Eiffel Tower')).toBeTruthy();
    expect(screen.getByText('Iron lattice tower.')).toBeTruthy();
    expect(screen.getByText('Champ de Mars, Paris')).toBeTruthy();
  });

  it('shows a not-found state for a 404 [edge case 4]', async () => {
    getLocation.mockRejectedValue(new LocationNotFoundError('nope'));
    renderWithClient(<LocationDetailScreen />);
    expect(await screen.findByText("We couldn't find that location.")).toBeTruthy();
  });

  it('shows an error state with a working retry affordance [edge cases 1 & 8]', async () => {
    getLocation.mockRejectedValue(new NetworkError('offline'));
    renderWithClient(<LocationDetailScreen />);

    expect(await screen.findByText('Something went wrong')).toBeTruthy();
    const callsBeforeRetry = getLocation.mock.calls.length;

    fireEvent.press(screen.getByText('Try again'));
    await waitFor(() => {
      expect(getLocation.mock.calls.length).toBeGreaterThan(callsBeforeRetry);
    });
  });

  it('pull-to-refresh re-fetches the location [edge case 9]', async () => {
    getLocation.mockResolvedValue(eiffel);
    renderWithClient(<LocationDetailScreen />);
    await screen.findByText('Eiffel Tower');

    fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');
    await waitFor(() => {
      expect(getLocation).toHaveBeenCalledTimes(2);
    });
  });
});
