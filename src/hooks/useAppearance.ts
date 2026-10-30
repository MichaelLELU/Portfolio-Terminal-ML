import { useEffect, useState } from 'react';
import { shells, themes } from '../config/shells';
import type { Palette, ShellId, ThemeId } from '../types/terminal';

export function useAppearance() {
  const [shell, setShell] = useState<ShellId>('powershell');
  const [theme, setTheme] = useState<ThemeId>('powershell');
  const [customColors, setCustomColors] = useState<Palette | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [typingSpeed, setTypingSpeed] = useState(12);
  const [crt, setCrt] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const changeShell = (value: ShellId) => {
    setShell(value);
    setTheme(shells[value].theme);
    setCustomColors(null);
  };
  const changeTheme = (value: ThemeId) => {
    setTheme(value);
    setCustomColors(null);
  };
  const resetAppearance = () => {
    changeShell('powershell');
    setCrt(false);
    setFontSize(14);
    setTypingSpeed(12);
  };

  return {
    shell, theme, palette: customColors ?? themes[theme], fontSize, typingSpeed, crt, settingsOpen, reducedMotion,
    setSettingsOpen, changeShell, changeTheme, setCustomColors, setFontSize, setTypingSpeed, setCrt, resetAppearance
  };
}
