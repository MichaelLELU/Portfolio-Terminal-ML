import { portfolio, root } from '../data';
import type { DirectoryNode, FileNode, FileSystemNode } from '../types/filesystem';
import type { Project } from '../types/portfolio';

export type VirtualPath = string[];

/** Résout une adresse relative ou absolue, sans jamais quitter la racine virtuelle. */
export function resolvePath(cwd: VirtualPath, input: string): VirtualPath {
  const raw = input.trim().replaceAll('\\', '/');
  if (!raw || raw === '.') return [...cwd];
  const homePrefix = /^(?:[A-Za-z]+:)?\/Developpeur\/MichaelLelu(?=\/|$)/i;
  const windowsHome = raw.match(homePrefix);
  const fromHome = windowsHome ? raw.slice(windowsHome[0].length) : raw;
  const absolute = !!windowsHome || fromHome.startsWith('/') || fromHome === '~' || fromHome.startsWith('~/');
  const clean = fromHome.replace(/^~(?=\/|$)/, '');
  const path = absolute ? [] : [...cwd];
  for (const part of clean.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') path.pop();
    else path.push(part);
  }
  return path;
}

export function getNode(path: VirtualPath): FileSystemNode | null {
  let node: FileSystemNode = root;
  for (const segment of path) {
    if (node.type !== 'directory') return null;
    const next: FileSystemNode | undefined = node.children.find(child => child.name.toLowerCase() === segment.toLowerCase());
    if (!next) return null;
    node = next;
  }
  return node;
}

export function getDirectory(path: VirtualPath): DirectoryNode | null {
  const node = getNode(path);
  return node?.type === 'directory' ? node : null;
}

export function getFile(path: VirtualPath): FileNode | null {
  const node = getNode(path);
  return node?.type === 'file' ? node : null;
}

export function listNames(dir: DirectoryNode): string[] {
  return [...dir.children].sort((a, b) => Number(b.type === 'directory') - Number(a.type === 'directory') || a.name.localeCompare(b.name)).map(n => n.name + (n.type === 'directory' ? '/' : ''));
}

export function formatTree(node: DirectoryNode, path: string = '.', prefix = ''): string[] {
  const output = [path];
  node.children.forEach((child, index) => {
    const last = index === node.children.length - 1;
    output.push(`${prefix}${last ? '└──' : '├──'} ${child.name}${child.type === 'directory' ? '/' : ''}`);
    if (child.type === 'directory') {
      const nested = formatTree(child, child.name, prefix + (last ? '    ' : '│   '));
      output.push(...nested.slice(1));
    }
  });
  return output;
}

function projectDocument(project: Project): string {
  return [`# ${project.title}`, '', project.description, '', '## Réalisations', ...project.highlights.map(value => `- ${value}`), '', '## Stack', project.stack.join(' · '), '', `Projet : ${project.slug}`].join('\n');
}

/** Références symboliques dans filesystem.json : aucune duplication des projets ou compétences. */
export function readFile(file: FileNode): string {
  const source = file.source;
  if (source.startsWith('projectStack:')) {
    const project = portfolio.projects.find(p => p.slug === source.slice('projectStack:'.length));
    return project ? JSON.stringify({ project: project.slug, stack: project.stack }, null, 2) : 'Projet introuvable';
  }
  if (source.startsWith('project:')) {
    const project = portfolio.projects.find(p => p.slug === source.slice('project:'.length));
    return project ? projectDocument(project) : 'Projet introuvable';
  }
  if (source.startsWith('skill:')) {
    const category = source.slice('skill:'.length);
    return JSON.stringify({ category, technologies: portfolio.skills[category] ?? [] }, null, 2);
  }
  switch (source) {
    case 'welcome': return `# ${portfolio.name}\n\n${portfolio.tagline} — ${portfolio.headline}\n\n${portfolio.about.join('\n\n')}\n\nExplore : about/ | projects/ | skills/ | contact/\nCommande : help`;
    case 'about': return `# À propos de ${portfolio.name}\n\n${portfolio.about.join('\n\n')}`;
    case 'experience': return portfolio.experience.map(item => `${item.role}\n${item.detail}`).join('\n\n');
    case 'skills': return JSON.stringify(portfolio.skills, null, 2);
    case 'skillsGuide': return '# Compétences\n\nLes fichiers JSON sont regroupés par spécialité.\n\ncat frontend.json\ncat backend.json\ncat databases.json\ncat dynamics.json\ncat integrations.json\ncat mobile.json\ncat tools.json';
    case 'projectIndex': return ['# Projets', '', ...portfolio.projects.map(p => `- ${p.slug}/ : ${p.title}`), '', 'Exemple : cd ratp && cat README.md (lance les commandes séparément)'].join('\n');
    case 'contact': return `# Contact\n\n${Object.entries(portfolio.links).map(([key, value]) => `${key}: ${value || '(à compléter dans portfolio.json)'}`).join('\n')}\n\nUtilise open github pour consulter un lien configuré.`;
    case 'links': return JSON.stringify(portfolio.links, null, 2);
    default: return `Référence de contenu inconnue : ${source}`;
  }
}
