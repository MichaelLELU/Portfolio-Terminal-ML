import type { CommandContext, CommandResult } from '../../types/terminal';
import { getDirectory, getFile, getNode, listNames, readFile, resolvePath, formatTree } from '../../utils/fileSystem';
import { accent, error, muted, multiline, normal } from '../format';
import { readablePath } from '../../config/shells';

const commands = new Set(['ls', 'dir', 'get-childitem', 'cd', 'set-location', 'pwd', 'get-location', 'cat', 'type', 'get-content', 'tree']);

export function fileCommand(name: string, args: string[], ctx: CommandContext): CommandResult | null {
  if (!commands.has(name)) return null;
  const target = args.filter(s => !/^(-[a-z]+|\/a)$/i.test(s))[0] ?? '.';
  const path = resolvePath(ctx.cwd, target);
  switch (name) {
    case 'pwd':
    case 'get-location': return { lines: [normal(readablePath(ctx.shell, ctx.cwd))] };
    case 'cd':
    case 'set-location': {
      const destination = args.length ? args[0] : '/';
      const resolved = resolvePath(ctx.cwd, destination);
      const node = getNode(resolved);
      if (!node) return { lines: [error(`cd : chemin introuvable : ${destination}`)] };
      if (node.type !== 'directory') return { lines: [error(`cd : n'est pas un dossier : ${destination}`)] };
      return { lines: [muted(`Dossier : /${resolved.join('/') || ''}`)], effects: [{ type: 'cwd', value: resolved }] };
    }
    case 'ls':
    case 'dir':
    case 'get-childitem': {
      const folder = getDirectory(path);
      if (!folder) return { lines: [error(`ls : dossier introuvable : ${target}`)] };
      const items = listNames(folder);
      return { lines: items.length ? items.map(v => v.endsWith('/') ? accent(v) : normal(v)) : [muted('(dossier vide)')] };
    }
    case 'tree': {
      const folder = getDirectory(path);
      return { lines: folder ? formatTree(folder, path.length ? path[path.length - 1] + '/' : 'MichaelLelu/').map(normal) : [error(`tree : dossier introuvable : ${target}`)] };
    }
    case 'cat':
    case 'type':
    case 'get-content': {
      if (!args.length) return { lines: [error(`Usage : ${name} <fichier>`)] };
      const file = getFile(resolvePath(ctx.cwd, args[0]));
      if (!file) return { lines: [error(`${name} : fichier introuvable : ${args[0]}`)] };
      return { lines: multiline(readFile(file)) };
    }
  }
  return null;
}
