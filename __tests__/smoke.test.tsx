import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

/**
 * Phase 1 smoke test: proves the jest-expo + React Native Testing Library
 * pipeline is wired correctly (transforms, renderer, matchers). Real unit and
 * component tests arrive in Phase 4.
 */
function Hello({ name }: { name: string }) {
  return (
    <View>
      <Text>Hello, {name}</Text>
    </View>
  );
}

describe('test environment', () => {
  it('renders a React Native component', () => {
    render(<Hello name="draftbit" />);
    expect(screen.getByText('Hello, draftbit')).toBeTruthy();
  });
});
