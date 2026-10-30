import { portfolio } from '../data';
import { shellIds, themeIds } from '../config/shells';
import { getDirectory, listNames } from '../utils/fileSystem';

const commands = ['help', 'whoami', 'about', 'projects', 'skills', 'experience', 'contact', 'cv', 'ls', 'dir', 'pwd', 'cd', 'cat', 'type', 'tree', 'history', 'clear', 'cls', 'theme', 'shell', 'neofetch', 'npm help', 'npm run projects', 'dotnet help', 'dotnet --info'];

export function getSuggestions(value: string, cwd: string[]): string[] {
  const query = value.trim().toLowerCase();
  const dir = getDirectory(cwd);
  const folders = dir ? listNames(dir).filter(v => v.endsWith('/')).map(v => v.slice(0, -1)) : [];
  const files = dir ? listNames(dir).filter(v => !v.endsWith('/')) : [];
  const options = [
    ...commands,
    ...shellIds.map(x => `shell ${x}`),
    ...themeIds.map(x => `theme ${x}`),
    ...portfolio.projects.map(p => `projects ${p.slug}`),
    ...folders.map(x => `cd ${x}`),
    ...files.map(x => `cat ${x}`),
    ...[...folders, ...files].map(x => `ls ${x}`)
  ];
  if (!query) return ['help', 'ls', 'projects', 'skills', 'contact'];
  return [...new Set(options.filter(x => x.toLowerCase().startsWith(query)))].slice(0, 7);
}
