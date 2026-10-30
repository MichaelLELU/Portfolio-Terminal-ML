import { portfolio } from '../data';
import { shells, shellIds, themes, themeIds } from '../config/shells';
import type { ShellId, ThemeId } from '../types/terminal';
import type { ReactNode } from 'react';

interface Props {
  shell: ShellId;
  theme: ThemeId;
  onShell: (shell: ShellId) => void;
  onTheme: (theme: ThemeId) => void;
  onCommand: (command: string) => void;
  appearancePanel?: ReactNode;
}

export function Sidebar({ shell, theme, onShell, onTheme, onCommand, appearancePanel }: Props) {
  const commands = ['whoami', 'projects', 'skills', 'experience', 'cv', 'contact', 'help'];
  return <aside className="side-panel" aria-label="Navigation et personnalisation">
    <section className="info-card theme-card">
      <div className="card-eyebrow">01 / ENVIRONNEMENT</div>
      <label htmlFor="shell-select">LANGAGE / TERMINAL</label>
      <select id="shell-select" value={shell} onChange={e => onShell(e.target.value as ShellId)}>
        {shellIds.map(id => <option key={id} value={id}>{shells[id].name}</option>)}
      </select>
      <div className="shell-description">{shells[shell].description}</div>
      <label htmlFor="theme-select">THÈME INDÉPENDANT</label>
      <select id="theme-select" value={theme} onChange={e => onTheme(e.target.value as ThemeId)}>
        {themeIds.map(id => <option key={id} value={id}>{id} ({themes[id].accent})</option>)}
      </select>
    </section>
    {appearancePanel}
    <section className="info-card profile-card">
      <div className="card-eyebrow">02 / IDENTITY</div>
      <div className="avatar">ML<span className="avatar-spark">✳</span></div>
      <h1>{portfolio.name}<span className="heading-dot">.</span></h1>
      <p>{portfolio.tagline}</p>
      <div className="pill-row"><span>.NET</span><span>React</span><span>D365</span></div>
      {portfolio.links.cv && <a className="cv-download" href={portfolio.links.cv} download="CV-Michael-Lelu.pdf">
        ↓ Télécharger mon CV (PDF)
      </a>}
    </section>
    <section className="info-card navigation-card">
      <div className="card-eyebrow">03 / QUICK EXECUTE</div>
      <div className="quick-grid">{commands.map((command, index) => <button type="button" key={command} onClick={() => onCommand(command)}>
        <span>{String(index + 1).padStart(2, '0')}</span><strong>{command}</strong><span>↗</span>
      </button>)}</div>
    </section>
  </aside>;
}
