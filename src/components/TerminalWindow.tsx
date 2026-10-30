import { useEffect, useRef } from 'react';
import type { ShellConfig, ShellId, TerminalEntry } from '../types/terminal';
import { promptFor } from '../config/shells';
import { outputLength } from '../hooks/useTypewriter';
import { TypedOutput } from './TypedOutput';
import { TerminalInput } from './TerminalInput';

export interface TerminalWindowProps {
  shell: ShellId;
  shellConfig: ShellConfig;
  cwd: string[];
  entries: TerminalEntry[];
  input: string;
  setInput: (text: string) => void;
  send: (text: string) => void;
  clear: () => void;
  historyBack: () => void;
  historyForward: () => void;
  suggestionsVisible: boolean;
  setSuggestionsVisible: (value: boolean) => void;
  typewriter: { visible: Record<number, number>; instant: boolean; isTyping: boolean; finish: () => void };
}

export function TerminalWindow(props: TerminalWindowProps) {
  const { shell, shellConfig, cwd, entries, input, setInput, send, clear, historyBack, historyForward, suggestionsVisible, setSuggestionsVisible, typewriter } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const pinnedToBottom = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  // Suivi automatique uniquement si le visiteur est déjà en bas de l'historique.
  // Il peut donc remonter lire les anciennes commandes pendant que le texte s'écrit.
  useEffect(() => {
    if (pinnedToBottom.current && scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [entries, typewriter.visible]);
  const onScroll = () => {
    const element = scroller.current;
    if (element) pinnedToBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 40;
  };
  const submit = (command: string) => { pinnedToBottom.current = true; send(command); };
  const clearAndReset = () => { pinnedToBottom.current = true; clear(); };
  const focus = () => inputRef.current?.focus();

  return <section className="terminal-frame" aria-label="Portfolio interactif en terminal" onClick={focus}>
    <div className="terminal-chrome">
      <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
      <span className="terminal-title"><strong>{shellConfig.name}</strong> <span>— michael.lelu / portfolio</span></span>
      <div className="terminal-actions">
        <span className="terminal-status">● {shellConfig.status}</span>
        {typewriter.isTyping && <button type="button" className="skip-typing-button" onClick={e => { e.stopPropagation(); typewriter.finish(); }}>⏩ Terminer</button>}
        <button type="button" className="clear-terminal-button" onClick={e => { e.stopPropagation(); clearAndReset(); focus(); }} title="Effacer (Ctrl+L)">⌫ Vider</button>
      </div>
    </div>
    <div className="terminal-screen" ref={scroller} onScroll={onScroll} role="log" aria-label="Historique des commandes" aria-live="off" tabIndex={0}>
      <div className="entries">
        {entries.map(entry => entry.kind === 'input'
          ? <div key={entry.id} className="entry command-entry"><span className="prompt-past">{entry.prompt}</span><span className="entered-command">{entry.command}</span></div>
          : <TypedOutput key={entry.id} entry={entry} visible={typewriter.instant ? outputLength(entry) : typewriter.visible[entry.id] ?? 0} typing={!typewriter.instant && (typewriter.visible[entry.id] ?? 0) < outputLength(entry)} />)}
      </div>
    </div>
    <div className="terminal-input-area">
      <TerminalInput prompt={promptFor(shell, cwd)} cwd={cwd} value={input} onChange={setInput} onSubmit={submit}
        onHistoryBack={historyBack} onHistoryForward={historyForward} onClear={clearAndReset} onFinish={typewriter.finish} isTyping={typewriter.isTyping}
        suggestionsVisible={suggestionsVisible} onSuggestionsVisible={setSuggestionsVisible} inputRef={inputRef} />
    </div>
    <div className="terminal-bottom"><span>TAB autocomplete · ↑/↓ historique · Ctrl+L vider · Échap terminer</span><span>UTF-8 | {shell.toUpperCase()} | FR</span></div>
  </section>;
}
