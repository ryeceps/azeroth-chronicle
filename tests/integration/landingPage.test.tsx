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

  it('offers a quiet library entry and starts the complete history', async () => {
    const user = userEvent.setup();
    const { container } = render(<MemoryRouter><LandingPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Every age leaves a story.' })).toBeVisible();
    expect(screen.getByRole('link', { name: /Explore tours/ })).toHaveAttribute('href', '/tours');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.landing-still')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /full tour of the history/i }));
    expect(useEraStore.getState().eraId).toBe('cosmic-origins');
    expect(useStoryStore.getState()).toMatchObject({ guideId: 'cosmic-origins-guided-history', nodeId: 'cosmic-origins-story-light-shadow', status: 'playing' });
  });
});
