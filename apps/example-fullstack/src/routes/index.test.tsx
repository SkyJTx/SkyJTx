import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import Home from './index';

describe('Home route', () => {
  it('renders home heading and description', () => {
    const { getByRole, getByText } = render(() => <Home />);
    expect(getByRole('heading', { level: 1 }).textContent).toBe('Solid Fullstack');
    expect(
      getByText('A lean fullstack foundation powered by Solid 2 and Solid Router.'),
    ).toBeDefined();
  });
});
