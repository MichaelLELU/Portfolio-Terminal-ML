import { portfolio } from '../../data';
import type { CommandResult } from '../../types/terminal';
import { accent, error, muted, normal, warning } from '../format';

export function portfolioCommand(name: string, args: string[]): CommandResult | null {
  switch (name) {
    case 'whoami': return { lines: [accent(`${portfolio.name} / ${portfolio.tagline}`), normal(portfolio.headline), muted(portfolio.location)] };
    case 'about': return { lines: [accent('À PROPOS'), ...portfolio.about.map(normal)] };
    case 'projects': {
      if (args[0]) {
        const project = portfolio.projects.find(p => p.slug === args[0].toLowerCase());
        return { lines: project ? [accent(project.title), normal(project.description), ...project.highlights.map(p => normal(`• ${p}`)), muted(`Stack : ${project.stack.join(', ')}`), muted(`cd /projects/${project.slug} puis cat README.md`)] : [error(`Projet inconnu : ${args[0]}`)] };
      }
      return { lines: [accent('MES PROJETS'), ...portfolio.projects.flatMap(project => [normal(`  ${project.slug}/  ${project.title}`), muted(`    ${project.description}`)]), muted('Explore : cd projects  |  projects ratp')] };
    }
    case 'skills': return { lines: [accent('COMPÉTENCES'), ...Object.entries(portfolio.skills).flatMap(([category, skills]) => [normal(category), muted(`  ${skills.join(' · ')}`)]), muted('Explore : cd skills  |  cat frontend.json')] };
    case 'experience': return { lines: [accent('PARCOURS'), ...portfolio.experience.flatMap(item => [normal(item.role), muted('  ' + item.detail)])] };
    case 'contact': return { lines: [accent('CONTACT'), ...Object.entries(portfolio.links).map(([label, link]) => link ? normal(`${label.padEnd(10)} ${link}`) : muted(`${label.padEnd(10)} (à configurer)`))] };
    case 'cv': return portfolio.links.cv
      ? { lines: [accent('Téléchargement du CV…'), muted('Le document PDF est également disponible dans le panneau de gauche.')], effects: [{ type: 'download', url: portfolio.links.cv }] }
      : { lines: [warning('CV non configuré : renseigne links.cv dans src/data/portfolio.json.')] };
    case 'open': {
      const key = args[0]?.toLowerCase() ?? '';
      const url = portfolio.links[key];
      if (!key || !(key in portfolio.links)) return { lines: [error('Usage : open github | linkedin | email | cv')] };
      if (!url) return { lines: [warning(`Lien « ${key} » non renseigné dans portfolio.json.`)] };
      if (key === 'email') return { lines: [accent('Ouverture du courriel…')], effects: [{ type: 'open', url: `mailto:${url}` }] };
      if (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/')) return { lines: [accent(`Ouverture : ${key}`)], effects: [{ type: 'open', url }] };
      return { lines: [error(`Lien invalide : ${key}`)] };
    }
  }
  return null;
}
