import { portfolio } from '../../data';
import { shellIds, shells, themeIds, isShellId, isThemeId } from '../../config/shells';
import type { CommandContext, CommandResult } from '../../types/terminal';
import { accent, error, muted, normal } from '../format';
import { portfolioCommand } from './portfolioCommands';

const alias = (command: string) => command === 'get-help' || command === '/?' || command === '--help' || command === '?' ? 'help' : command;

export function systemCommand(rawName: string, args: string[], ctx: CommandContext): CommandResult | null {
  const name = alias(rawName);
  switch (name) {
    case 'help': return { lines: [
      accent('COMMANDES PRINCIPALES'),
      normal('help / Get-Help        Aide du portfolio'),
      normal('whoami / about         Présentation'),
      normal('projects [nom]         Réalisations détaillées'),
      normal('skills / experience    Compétences et parcours'),
      normal('contact / cv           Coordonnées et CV'),
      normal('ls / dir / Get-ChildItem  Voir le dossier actuel'),
      normal('cd <dossier>           Naviguer (../ et chemins imbriqués)'),
      normal('cat / type / Get-Content <fichier>   Lire un vrai fichier virtuel'),
      normal('pwd / tree             Chemin actuel / arborescence'),
      normal('shell <nom>            powershell | bash | cmd | zsh'),
      normal('theme <nom>            Choisir une palette (matrix, amber…)'),
      normal('clear / cls            Vider le terminal'),
      normal('npm help / dotnet help  Alias de développeur'),
      muted('TAB : autocomplétion  •  ↑/↓ : historique  •  Ctrl+L : vider'),
      muted('Essayez : cd projects → ls → cd ratp → cat README.md')
    ] };
    case 'shell':
    case 'lang': {
      const value = args[0]?.toLowerCase() ?? '';
      if (!value) return { lines: [accent(`Shells : ${shellIds.join(', ')}`)] };
      if (!isShellId(value)) return { lines: [error(`Shell inconnu : ${value}`)] };
      return { lines: [accent(`${shells[value].name} activé. Habillage adapté.`)], effects: [{ type: 'shell', value }] };
    }
    case 'theme': {
      const value = args[0]?.toLowerCase() ?? '';
      if (!value) return { lines: [accent(`Thèmes : ${themeIds.join(', ')}`)] };
      if (!isThemeId(value)) return { lines: [error(`Thème inconnu : ${value}`)] };
      return { lines: [accent(`Thème ${value} activé.`)], effects: [{ type: 'theme', value }] };
    }
    case 'matrix': return { lines: [accent('Follow the green code.')], effects: [{ type: 'theme', value: 'matrix' }] };
    case 'clear':
    case 'cls': return { lines: [], effects: [{ type: 'clear' }] };
    case 'history': return { lines: [...ctx.history, [rawName, ...args].join(' ')].map((command, i) => normal(`${String(i + 1).padStart(2, '0')}  ${command}`)) };
    case 'echo': return { lines: [normal(args.join(' '))] };
    case 'neofetch': return { lines: [accent(`>_  ${portfolio.name}`), normal(`OS     Portfolio Web`), normal(`Shell  ${shells[ctx.shell].name}`), normal(`Stack  ${portfolio.headline}`), muted(portfolio.location)] };
    case 'npm': {
      if (args[0] === 'run') {
        const task = args[1]?.toLowerCase() ?? '';
        const result = portfolioCommand(task, []);
        return result && ['about', 'projects', 'skills', 'contact'].includes(task) ? { lines: [accent(`> portfolio@2.0.0 ${task}`), ...result.lines] } : { lines: [error(`Script inconnu : ${task || '(vide)'}`)] };
      }
      return { lines: [accent('NPM SCRIPTS VIRTUELS'), normal('npm run about'), normal('npm run projects'), normal('npm run skills'), normal('npm run contact'), muted('Simulation dans le navigateur : aucune commande système exécutée.')] };
    }
    case 'dotnet': {
      const task = args[0]?.toLowerCase() ?? 'help';
      if (task === '--info') return { lines: [accent('DÉVELOPPEMENT .NET'), normal('C# · ASP.NET Core · EF Core · Web API · SQL Server'), muted('Aucun SDK installé ou exécuté dans le navigateur.')] };
      if (['projects', 'skills'].includes(task)) return portfolioCommand(task, []);
      return { lines: [accent('.NET CLI VIRTUELLE'), normal('dotnet --info'), normal('dotnet projects'), normal('dotnet skills'), muted('Commande de démonstration uniquement.')] };
    }
  }
  return null;
}
