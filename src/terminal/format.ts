import type { TerminalLine, Tone } from '../types/terminal';
export const line = (text: string, tone: Tone = 'normal'): TerminalLine => ({ text, tone });
export const normal = (text: string) => line(text);
export const muted = (text: string) => line(text, 'muted');
export const accent = (text: string) => line(text, 'accent');
export const warning = (text: string) => line(text, 'warning');
export const error = (text: string) => line(text, 'error');
export const multiline = (text: string): TerminalLine[] => text.split('\n').map(normal);
