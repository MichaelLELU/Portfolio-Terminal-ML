export type ShellId = 'powershell' | 'bash' | 'cmd' | 'zsh';
export type ThemeId = 'powershell' | 'ubuntu' | 'classic' | 'macos' | 'matrix' | 'midnight' | 'amber' | 'light';
export type Tone = 'normal' | 'accent' | 'muted' | 'error' | 'warning';
export interface TerminalLine { tone: Tone; text: string; }
export interface InputEntry { id: number; kind: 'input'; prompt: string; command: string; }
export interface OutputEntry { id: number; kind: 'output'; lines: TerminalLine[]; }
export type TerminalEntry = InputEntry | OutputEntry;
export interface Palette { bg: string; fg: string; accent: string; }
export interface ShellConfig {
  id: ShellId;
  name: string;
  platform: string;
  description: string;
  theme: ThemeId;
  icon: string;
  status: string;
}
export interface CommandContext {
  cwd: string[];
  shell: ShellId;
  history: string[];
}
export type CommandEffect =
  | { type: 'cwd'; value: string[] }
  | { type: 'shell'; value: ShellId }
  | { type: 'theme'; value: ThemeId }
  | { type: 'clear' }
  | { type: 'open'; url: string }
  | { type: 'download'; url: string };
export interface CommandResult { lines: TerminalLine[]; effects?: CommandEffect[]; }
