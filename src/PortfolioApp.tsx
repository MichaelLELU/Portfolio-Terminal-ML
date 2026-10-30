import type { CSSProperties } from 'react';
import { shells } from './config/shells';
import { useAppearance } from './hooks/useAppearance';
import { useTerminal } from './hooks/useTerminal';
import { TerminalWindow } from './components/TerminalWindow';
import { Sidebar } from './components/Sidebar';
import { AppearancePanel } from './components/AppearancePanel';
import { MatrixRain } from './components/MatrixRain';

export default function PortfolioApp() {
  const appearance = useAppearance();
  const terminal = useTerminal({
    shell: appearance.shell,
    typingSpeed: appearance.typingSpeed,
    reducedMotion: appearance.reducedMotion,
    changeShell: appearance.changeShell,
    changeTheme: appearance.changeTheme
  });
  const palette = appearance.palette;
  const cssVars = {
    '--terminal-bg': palette.bg,
    '--terminal-fg': palette.fg,
    '--terminal-accent': palette.accent,
    '--terminal-font-size': `${appearance.fontSize}px`
  } as CSSProperties;

  return <main className={`app theme-${appearance.theme} shell-${appearance.shell} ${appearance.crt ? 'crt' : ''}`} style={cssVars}>
    <MatrixRain active={appearance.theme === 'matrix'} />
    <div className="app-shell">
      <header className="site-head">
        <div className="brand"><span className="brand-icon">{shells[appearance.shell].icon}</span><span>MICHAËL<span className="dim-text">.DEV</span></span><span className="version">/ {shells[appearance.shell].platform}</span></div>
        <div className="header-right"><span className="live-indicator"><i /> SYSTEM ONLINE</span>
          <button type="button" className="settings-toggle" onClick={() => appearance.setSettingsOpen(!appearance.settingsOpen)}
            aria-expanded={appearance.settingsOpen} aria-controls="customize-panel">⚙ <span>Personnaliser</span></button>
        </div>
      </header>
      <div className="content-grid">
        <Sidebar shell={appearance.shell} theme={appearance.theme} onShell={appearance.changeShell}
          onTheme={appearance.changeTheme} onCommand={terminal.send}
          appearancePanel={appearance.settingsOpen &&
            <AppearancePanel theme={appearance.theme} palette={appearance.palette} fontSize={appearance.fontSize}
              typingSpeed={appearance.typingSpeed} crt={appearance.crt} reducedMotion={appearance.reducedMotion}
              onTheme={appearance.changeTheme} onColors={appearance.setCustomColors} onFont={appearance.setFontSize}
              onTyping={appearance.setTypingSpeed} onCrt={appearance.setCrt}
              onReset={appearance.resetAppearance} onClose={() => appearance.setSettingsOpen(false)} />} />
        <TerminalWindow shell={appearance.shell} shellConfig={shells[appearance.shell]} {...terminal} />
      </div>
      <footer className="site-foot"><span>BUILT WITH REACT + TYPESCRIPT <span className="footer-symbol">✦</span> DEVELOPED BY MICHAËL LELU</span><span>EXPLORE • DISCOVER • CONNECT</span></footer>
    </div>
  </main>;
}
