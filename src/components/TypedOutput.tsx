import { useMemo } from 'react';
import type { OutputEntry } from '../types/terminal';

interface Props { entry: OutputEntry; visible: number; typing: boolean; }

export function TypedOutput({ entry, visible, typing }: Props) {
  const rows = useMemo(() => {
    const output: { tone: string; text: string }[] = [];
    let count = visible;
    for (const row of entry.lines) {
      if (count <= 0) break;
      const chars = Array.from(row.text);
      output.push({ tone: row.tone, text: chars.slice(0, Math.min(chars.length, count)).join('') });
      count -= chars.length + 1;
    }
    if (!output.length && typing) output.push({ tone: 'accent', text: '' });
    return output;
  }, [entry.lines, visible, typing]);

  return <div className="entry output-entry">
    {rows.map((row, index) => <div className={`output-line tone-${row.tone}`} key={index}>
      {row.text || '\u00a0'}{typing && index === rows.length - 1 && <span className="typing-caret" aria-hidden="true" />}
    </div>)}
  </div>;
}
