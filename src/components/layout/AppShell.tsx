import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export function AppShell({ children }: { children: ReactNode }) {

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">A</span>
          <span>
            <strong>Azerothium</strong>
            <small>Unofficial fan atlas</small>
          </span>
        </NavLink>
        <div className="topbar-actions">
          <nav aria-label="Primary navigation">
            <NavLink to="/tours">Tours</NavLink>
            <NavLink to="/archive">Archive</NavLink>
          </nav>
        </div>
      </header>
      {children}
      <footer className="footer">
        <strong>Unofficial fan project.</strong> Azerothium is a fan-made interpretation of the Warcraft universe
        and is not affiliated with, endorsed by, sponsored by, or approved by Blizzard Entertainment.
      </footer>
    </div>
  );
}
