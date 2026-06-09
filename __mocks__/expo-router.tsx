/**
 * Test mock for `expo-router`. Provides a jest-spyable imperative `router`, a
 * controllable `useLocalSearchParams`, and no-op `Stack`/`Stack.Screen` so screen
 * components can be rendered in isolation without the navigation tree.
 */
export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

export const useLocalSearchParams = jest.fn(() => ({}));

export const Stack = Object.assign(() => null, {
  Screen: () => null,
});
