import type { CommandContext, CommandResult } from '../types/terminal';
import { error, muted } from './format';
import { fileCommand } from './commands/fileCommands';
import { portfolioCommand } from './commands/portfolioCommands';
import { systemCommand } from './commands/systemCommands';

/** Exécution pure et synchrone ; aucune commande du PC du visiteur n'est lancée. */
export function executeCommand(raw: string, context: CommandContext): CommandResult {
  const args = raw.trim().match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map(s => s.replace(/^["']|["']$/g, '')) ?? [];
  const name = args.shift()?.toLowerCase() ?? '';
  if (!name) return { lines: [] };
  return fileCommand(name, args, context)
    ?? portfolioCommand(name, args)
    ?? systemCommand(name, args, context)
    ?? { lines: [error(`Commande inconnue : ${name}`), muted('Tape help pour découvrir les commandes.')] };
}
