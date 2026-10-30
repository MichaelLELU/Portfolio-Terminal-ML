import type { CSSProperties } from 'react';
import { themes, themeIds } from '../config/shells';
import type { Palette, ThemeId } from '../types/terminal';

interface Props {
  theme: ThemeId;
  palette: Palette;
  fontSize: number;
  typingSpeed: number;
  crt: boolean;
  reducedMotion: boolean;
  onTheme: (theme: ThemeId) => void;
  onColors: (value: Palette) => void;
  onFont: (value: number) => void;
  onTyping: (value: number) => void;
  onCrt: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
}

export function AppearancePanel(props: Props) {
  const { theme, palette, fontSize, typingSpeed, crt, reducedMotion, onTheme, onColors, onFont, onTyping, onCrt, onReset, onClose } = props;
  return <div className="customize-panel" id="customize-panel">
    <div className="panel-header"><strong>PERSONNALISATION</strong><button aria-label="Fermer" onClick={onClose}>✕</button></div>
    <p>Le shell définit l'interface. Les thèmes et couleurs restent personnalisables.</p>
    <div className="theme-swatches">{themeIds.map(id => <button type="button" key={id} className={theme === id ? 'selected' : ''}
      style={{ '--swatch': themes[id].bg, '--swatch-accent': themes[id].accent } as CSSProperties}
      onClick={() => onTheme(id)} title={`Thème ${id}`}><span>›_</span><small>{id}</small></button>)}</div>
    <div className="color-grid">
      <label>Fond<input type="color" value={palette.bg} onChange={e => onColors({ ...palette, bg: e.target.value })} /></label>
      <label>Texte<input type="color" value={palette.fg} onChange={e => onColors({ ...palette, fg: e.target.value })} /></label>
      <label>Accent<input type="color" value={palette.accent} onChange={e => onColors({ ...palette, accent: e.target.value })} /></label>
    </div>
    <label className="range-label" htmlFor="font-size">Taille du texte <strong>{fontSize}px</strong></label>
    <input id="font-size" type="range" min="11" max="20" value={fontSize} onChange={e => onFont(+e.target.value)} />
    <label className="range-label" htmlFor="typing-speed">Vitesse d'écriture</label>
    <select className="typing-speed-select" id="typing-speed" value={typingSpeed} onChange={e => onTyping(+e.target.value)}>
      <option value={32}>Lente</option><option value={12}>Normale</option><option value={5}>Rapide</option><option value={0}>Désactivée</option>
    </select>
    {reducedMotion && <p className="motion-note">Animation désactivée selon les préférences d'accessibilité du système.</p>}
    <label className="toggle-row"><input type="checkbox" checked={crt} onChange={e => onCrt(e.target.checked)} /> Effet écran CRT</label>
    <button className="reset-button" onClick={onReset}>Réinitialiser</button>
  </div>;
}
