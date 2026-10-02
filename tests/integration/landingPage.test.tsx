import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useEraStore } from '../../src/app/state/eraStore';
import { useStoryStore } from '../../src/app/state/storyStore';
import { LandingPage } from '../../src/pages/LandingPage';

describe('landing page', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useEraStore.setState({ eraId: 'black-empire' });
    useStoryStore.setState({ guideId: null, nodeId: null, status: 'paused', branchReturn: null });
  });

  it('offers the Mega Tour and a route to the Tours hub', async () => {
    const user = userEvent.setup();
    const { container } = render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Start with the ages/ })).toBeVisible();
    expect(screen.getByRole('link', { name: /Explore maps & era tours/ })).toHaveAttribute('href', '/tours');
    expect(screen.getByText(/Estimated .* · era tours, then storylines/)).toBeVisible();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.landing-still')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /Start the Mega Tour/ }));
    expect(useEraStore.getState().eraId).toBe('cosmic-origins');
    expect(useStoryStore.getState()).toMatchObject({ guideId: 'cosmic-origins-guided-history', nodeId: 'cosmic-origins-story-light-shadow', status: 'playing' });
  });
});
