import type { Palette, ShellConfig, ShellId, ThemeId } from '../types/terminal';

export const shells: Record<ShellId, ShellConfig> = {
  powershell: { id: 'powershell', name: 'Windows PowerShell', platform: 'WINDOWS 11', description: 'Console Microsoft · Bleu électrique', theme: 'powershell', icon: 'PS', status: 'PS SESSION' },
  bash: { id: 'bash', name: 'Ubuntu Terminal', platform: 'GNU / LINUX', description: 'Bash · Style Ubuntu', theme: 'ubuntu', icon: '$', status: 'BASH SESSION' },
  cmd: { id: 'cmd', name: 'Invite de commandes', platform: 'WINDOWS NT', description: 'CMD · Console rétro Windows', theme: 'classic', icon: 'C:', status: 'CMD SESSION' },
  zsh: { id: 'zsh', name: 'macOS Terminal', platform: 'UNIX / MACOS', description: 'Zsh · Style macOS', theme: 'macos', icon: '%', status: 'ZSH SESSION' }
};

export const themes: Record<ThemeId, Palette> = {
  powershell: { bg: '#071a42', fg: '#e2edff', accent: '#77c6ff' },
  ubuntu: { bg: '#241728', fg: '#f5e9f4', accent: '#ffac79' },
  classic: { bg: '#080808', fg: '#eeeeee', accent: '#b6fba3' },
  macos: { bg: '#192032', fg: '#e7e9f5', accent: '#9ce2d9' },
  matrix: { bg: '#07110c', fg: '#c1f9d8', accent: '#67fbb5' },
  midnight: { bg: '#0b1020', fg: '#d7e5ff', accent: '#87abff' },
  amber: { bg: '#191207', fg: '#ffe8a3', accent: '#ffbe55' },
  light: { bg: '#f3f5f7', fg: '#233145', accent: '#167d68' }
};

export const shellIds = Object.keys(shells) as ShellId[];
export const themeIds = Object.keys(themes) as ThemeId[];

export function isShellId(value: string): value is ShellId { return value in shells; }
export function isThemeId(value: string): value is ThemeId { return value in themes; }

export function promptFor(shell: ShellId, cwd: string[]): string {
  const windowsPath = cwd.length ? `\\${cwd.join('\\')}` : '';
  const unixPath = cwd.length ? `/${cwd.join('/')}` : '';
  switch (shell) {
    case 'powershell': return `Vie:\\Developpeur\\MichaelLelu${windowsPath}>`;
    case 'cmd': return `C:\\Developpeur\\MichaelLelu${windowsPath}>`;
    case 'zsh': return `➜  ~${unixPath} %`;
    case 'bash': return `michael@portfolio:~${unixPath}$`;
  }
}

export function readablePath(shell: ShellId, cwd: string[]): string {
  return promptFor(shell, cwd).replace(/[>$%]\s*$/, '').trim();
}
