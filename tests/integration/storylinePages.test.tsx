import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { EraPage } from '../../src/pages/EraPage';
import { StorylineLibraryPage } from '../../src/pages/StorylineLibraryPage';
import { StorylinePage } from '../../src/pages/StorylinePage';

function renderRoutes(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/eras/:slug" element={<EraPage />} />
        <Route path="/storylines" element={<StorylineLibraryPage />} />
        <Route path="/storylines/:slug" element={<StorylinePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('era-linked storylines', () => {
  it('shows the through-Wrath archive and keeps later expansion previews out of the library', () => {
    renderRoutes('/storylines');
    expect(screen.getByText(/archive covers ancient history through Wrath of the Lich King/)).toBeVisible();
    expect(screen.getByText('25 stories')).toBeVisible();
    expect(screen.getByRole('link', { name: /Galakrond and the Five Proto-Dragons/ })).toBeVisible();
    expect(screen.getByRole('link', { name: /Quel’Delar: The Broken Blade Restored/ })).toBeVisible();
    expect(screen.queryByRole('link', { name: /Dragonwrath|Suramar and the Nightwell|From Sunwell to Dawnwell/ })).not.toBeInTheDocument();
  });

  it('returns the missing-record view for a removed expansion storyline URL', () => {
    renderRoutes('/storylines/suramar-nightwell-rebellion');
    expect(screen.getByRole('heading', { name: 'Record not found' })).toBeVisible();
  });

  it('filters by related era and opens the Scepter chapter outline', async () => {
    const user = userEvent.setup();
    renderRoutes('/storylines?era=long-vigil-new-kingdoms');

    expect(screen.getByRole('heading', { name: 'Stories connected to The Long Vigil and the New Kingdoms' })).toBeVisible();
    await user.click(screen.getByRole('link', { name: /The Scepter of the Shifting Sands/ }));

    expect(screen.getByRole('heading', { level: 1, name: 'The Scepter of the Shifting Sands' })).toBeVisible();
    expect(screen.getByRole('heading', { name: /The war that raised the wall/ })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'The gates open' })).toBeVisible();
    expect(screen.getByRole('link', { name: /War of the Shifting Sands/ })).toHaveAttribute('href', 'https://worldofwarcraft.blizzard.com/en-us/media/short-story/war-of-the-shifting-sands');
  });

  it('exposes the same cross-era story from both era dossiers', () => {
    const first = renderRoutes('/eras/long-vigil-new-kingdoms');
    expect(within(first.container).getByRole('link', { name: /The Scepter of the Shifting Sands/ })).toHaveAttribute('href', '/storylines/scepter-of-the-shifting-sands');
    first.unmount();

    const second = renderRoutes('/eras/age-of-adventurers');
    expect(within(second.container).getByRole('link', { name: /The Scepter of the Shifting Sands/ })).toHaveAttribute('href', '/storylines/scepter-of-the-shifting-sands');
    second.unmount();

    renderRoutes('/eras/war-of-the-ancients');
    expect(screen.queryByRole('link', { name: /The Scepter of the Shifting Sands/ })).not.toBeInTheDocument();
  });
});
