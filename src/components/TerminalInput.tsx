import type { KeyboardEvent, RefObject } from 'react';
import { getSuggestions } from '../terminal/suggestions';

interface Props {
  prompt: string;
  cwd: string[];
  value: string;
  onChange: (next: string) => void;
  onSubmit: (text: string) => void;
  onHistoryBack: () => void;
  onHistoryForward: () => void;
  onClear: () => void;
  onFinish: () => void;
  isTyping: boolean;
  suggestionsVisible: boolean;
  onSuggestionsVisible: (value: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function TerminalInput(props: Props) {
  const { prompt, cwd, value, onChange, onSubmit, onHistoryBack, onHistoryForward, onClear, onFinish, isTyping, suggestionsVisible, onSuggestionsVisible, inputRef } = props;
  const suggestions = getSuggestions(value, cwd);
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter': event.preventDefault(); onSubmit(value); break;
      case 'Tab': event.preventDefault(); if (suggestions.length) { onChange(suggestions[0]); onSuggestionsVisible(false); } break;
      case 'ArrowUp': event.preventDefault(); onHistoryBack(); onSuggestionsVisible(false); break;
      case 'ArrowDown': event.preventDefault(); onHistoryForward(); onSuggestionsVisible(false); break;
      case 'Escape': if (isTyping) onFinish(); else onSuggestionsVisible(false); break;
      default: if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); onClear(); }
    }
  };

  return <>
    <div className="input-line">
      <label htmlFor="command-input" className="prompt-live">{prompt}</label>
      <input id="command-input" ref={inputRef} spellCheck={false} autoComplete="off" autoCapitalize="off" autoCorrect="off"
        aria-label="Saisir une commande" value={value}
        onChange={e => { onChange(e.target.value); onSuggestionsVisible(true); }}
        onKeyDown={keyDown} onFocus={() => onSuggestionsVisible(true)} />
      <span className="cursor-decoration" aria-hidden="true">▌</span>
    </div>
    {suggestionsVisible && suggestions.length > 0 && <div className="suggestion-row" aria-label="Suggestions de commandes">
      <span className="hint-prefix">SUGGESTIONS</span>
      {suggestions.map(s => <button type="button" key={s} onClick={e => { e.stopPropagation(); onChange(s); onSuggestionsVisible(false); inputRef.current?.focus(); }}>{s}</button>)}
    </div>}
  </>;
}
