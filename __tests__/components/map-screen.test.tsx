import { fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import MapScreen from '../../app/index';
import { locationService } from '../../src/lib/config/locations';
import { renderWithClient } from '../test-utils';

jest.mock('../../src/lib/config/locations', () => ({
  locationService: { getLocations: jest.fn(), getLocation: jest.fn() },
}));

const locA = {
  id: 'sf-golden-gate',
  name: 'Golden Gate Bridge',
  description: 'Bridge',
  latitude: 37.8199,
  longitude: -122.4783,
};
const locB = {
  id: 'par-eiffel',
  name: 'Eiffel Tower',
  description: 'Tower',
  latitude: 48.8584,
  longitude: 2.2945,
};

const getLocations = jest.mocked(locationService.getLocations);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('MapScreen', () => {
  it('shows a loading state while fetching [edge case 7]', () => {
    getLocations.mockReturnValue(new Promise<never>(() => {}));
    renderWithClient(<MapScreen />);
    expect(screen.getByText('Loading locations…')).toBeTruthy();
  });

  it('renders a marker per location and navigates on tap', async () => {
    getLocations.mockResolvedValue([locA, locB]);
    renderWithClient(<MapScreen />);

    expect(await screen.findByTestId('map-view')).toBeTruthy();
    expect(screen.getByTestId('marker-sf-golden-gate')).toBeTruthy();
    expect(screen.getByTestId('marker-par-eiffel')).toBeTruthy();

    fireEvent.press(screen.getByTestId('marker-sf-golden-gate'));
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/location/[id]',
      params: { id: 'sf-golden-gate' },
    });
  });

  it('shows an empty state when there are no locations [edge case 2]', async () => {
    getLocations.mockResolvedValue([]);
    renderWithClient(<MapScreen />);
    expect(await screen.findByText('No locations to show yet.')).toBeTruthy();
  });

  it('shows an error state, and retry recovers [edge cases 1 & 8]', async () => {
    getLocations.mockRejectedValueOnce(new Error('API down')).mockResolvedValueOnce([locA]);
    renderWithClient(<MapScreen />);

    expect(await screen.findByText('Something went wrong')).toBeTruthy();
    fireEvent.press(screen.getByText('Try again'));

    expect(await screen.findByTestId('marker-sf-golden-gate')).toBeTruthy();
    expect(getLocations).toHaveBeenCalledTimes(2);
  });

  it('does not issue duplicate fetches while one is in flight [edge case 6]', () => {
    getLocations.mockReturnValue(new Promise<never>(() => {}));
    renderWithClient(<MapScreen />);
    expect(getLocations).toHaveBeenCalledTimes(1);
  });
});
