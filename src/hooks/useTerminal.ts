import { useCallback, useRef, useState } from 'react';
import type { InputEntry, OutputEntry, ShellId, ThemeId, TerminalEntry, TerminalLine } from '../types/terminal';
import { promptFor } from '../config/shells';
import { executeCommand } from '../terminal/executor';
import { accent, muted, normal } from '../terminal/format';
import { useTypewriter } from './useTypewriter';

interface Options {
  shell: ShellId;
  typingSpeed: number;
  reducedMotion: boolean;
  changeShell: (shell: ShellId) => void;
  changeTheme: (theme: ThemeId) => void;
}

const welcomeLines: TerminalLine[] = [
  muted('MICHAELLELU.DEV / INTERACTIVE PORTFOLIO                      v2.0 · TYPESCRIPT'),
  accent(''),
  accent('  ╔══════════════════════════════════════════════════╗'),
  accent('  ║  MICHAËL LELU  //  FULL-STACK DEVELOPER            ║'),
  accent('  ╚══════════════════════════════════════════════════╝'),
  normal('  .NET · REACT · TYPESCRIPT · DYNAMICS 365'),
  muted('  Bienvenue ! Les dossiers contiennent de vrais fichiers virtuels.'),
  muted('  Essaie : ls  →  cd projects  →  ls  →  cd ratp  →  cat README.md'),
  muted('  Tape help pour explorer le portfolio.'),
  muted('')
];

export function useTerminal(options: Options) {
  const { shell, typingSpeed, reducedMotion, changeShell, changeTheme } = options;
  const [cwd, setCwd] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<TerminalEntry[]>([{ id: 1, kind: 'output', lines: welcomeLines }]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const nextId = useRef(1);
  const typewriter = useTypewriter(entries, typingSpeed, reducedMotion);
  const { finish, reset } = typewriter;

  const clear = useCallback(() => {
    setEntries([]);
    reset();
    setInput('');
    setSuggestionsVisible(false);
    setHistoryPointer(-1);
  }, [reset]);

  const send = useCallback((raw: string) => {
    const command = raw.trim();
    if (!command) return;
    finish();
    const result = executeCommand(command, { cwd, shell, history });
    setHistory(previous => [...previous, command]);
    setHistoryPointer(-1);
    setSuggestionsVisible(false);
    setInput('');
    const shouldClear = result.effects?.some(effect => effect.type === 'clear');
    if (shouldClear) {
      clear();
    } else {
      const inputEntry: InputEntry = { id: ++nextId.current, kind: 'input', command, prompt: promptFor(shell, cwd) };
      const outputEntry: OutputEntry = { id: ++nextId.current, kind: 'output', lines: result.lines };
      setEntries(previous => [...previous, inputEntry, outputEntry]);
    }
    result.effects?.forEach(effect => {
      switch (effect.type) {
        case 'cwd': setCwd(effect.value); break;
        case 'shell': changeShell(effect.value); break;
        case 'theme': changeTheme(effect.value); break;
        case 'open': {
          if (effect.url.startsWith('mailto:')) window.location.href = effect.url;
          else window.open(effect.url, '_blank', 'noopener,noreferrer');
          break;
        }
        case 'download': {
          const link = document.createElement('a');
          link.href = effect.url;
          link.download = 'CV-Michael-Lelu.pdf';
          document.body.appendChild(link);
          link.click();
          link.remove();
          break;
        }
        case 'clear': break;
      }
    });
  }, [cwd, shell, history, finish, changeShell, changeTheme, clear]);

  const historyBack = useCallback(() => {
    if (!history.length) return;
    const pointer = historyPointer < 0 ? history.length - 1 : Math.max(0, historyPointer - 1);
    setHistoryPointer(pointer);
    setInput(history[pointer]);
  }, [history, historyPointer]);

  const historyForward = useCallback(() => {
    if (historyPointer < 0) return;
    const next = historyPointer + 1;
    setHistoryPointer(next < history.length ? next : -1);
    setInput(next < history.length ? history[next] : '');
  }, [history, historyPointer]);

  return {
    cwd, entries, input, setInput, suggestionsVisible, setSuggestionsVisible,
    historyBack, historyForward, send, clear, typewriter
  };
}
