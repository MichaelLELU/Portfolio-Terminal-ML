import { useCallback, useEffect, useState } from 'react';
import type { TerminalEntry, OutputEntry } from '../types/terminal';

export function outputLength(entry: OutputEntry): number {
  return entry.lines.reduce((count, row) => count + Array.from(row.text).length + 1, 0);
}

export function useTypewriter(entries: TerminalEntry[], speed: number, reducedMotion: boolean) {
  // Les réponses présentes au premier affichage (bannière d'accueil) sont instantanées.
  // Les nouvelles sorties ajoutées ensuite conservent l'effet machine à écrire.
  const [visible, setVisible] = useState<Record<number, number>>(() =>
    Object.fromEntries(entries.filter((entry): entry is OutputEntry => entry.kind === 'output')
      .map(entry => [entry.id, outputLength(entry)]))
  );
  const instant = speed === 0 || reducedMotion;
  const isTyping = !instant && entries.some(e => e.kind === 'output' && (visible[e.id] ?? 0) < outputLength(e));

  const finish = useCallback(() => setVisible(current => {
    const next = { ...current };
    entries.forEach(entry => { if (entry.kind === 'output') next[entry.id] = outputLength(entry); });
    return next;
  }), [entries]);

  const reset = useCallback(() => setVisible({}), []);

  useEffect(() => {
    if (instant) { finish(); return; }
    let raf = 0;
    let last = performance.now();
    let fraction = 0;
    const frame = (now: number) => {
      fraction += Math.min(now - last, 100) / speed;
      last = now;
      let budget = Math.floor(fraction);
      fraction -= budget;
      if (budget) setVisible(current => {
        const updated = { ...current };
        let changed = false;
        for (const entry of entries) {
          if (entry.kind !== 'output' || budget <= 0) continue;
          const remaining = outputLength(entry) - (updated[entry.id] ?? 0);
          const advance = Math.min(budget, remaining);
          if (advance > 0) {
            updated[entry.id] = (updated[entry.id] ?? 0) + advance;
            budget -= advance;
            changed = true;
          }
        }
        return changed ? updated : current;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [entries, speed, instant, finish]);

  return { visible, instant, isTyping, finish, reset };
}
