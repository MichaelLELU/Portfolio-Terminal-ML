import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCommand } from '../terminal/executor';
import { getDirectory, getFile, listNames, readFile, resolvePath } from './fileSystem';

const ctx = (cwd: string[] = []) => ({ cwd, shell: 'powershell' as const, history: [] });
const texts = (command: string, cwd: string[] = []) => executeCommand(command, ctx(cwd)).lines.map(line => line.text).join('\n');

test('ls affiche uniquement les éléments du dossier courant', () => {
  assert.match(texts('ls'), /projects\//);
  assert.doesNotMatch(texts('ls', ['about']), /projects\//);
  assert.match(texts('ls', ['about']), /bio\.md/);
  assert.match(texts('ls', ['projects', 'ratp']), /stack\.json/);
  assert.doesNotMatch(texts('ls', ['projects', 'ratp']), /made-in-broke/);
});

test('cd gère les dossiers imbriqués, les chemins relatifs et ..', () => {
  const cd = executeCommand('cd projects/ratp', ctx());
  assert.deepEqual(cd.effects, [{ type: 'cwd', value: ['projects', 'ratp'] }]);
  assert.deepEqual(resolvePath(['projects', 'ratp'], '../../about'), ['about']);
  assert.deepEqual(resolvePath(['projects', 'ratp'], '/contact'), ['contact']);
  assert.deepEqual(resolvePath(['projects'], '../..'), []);
  assert.deepEqual(resolvePath([], 'C:\\Developpeur\\MichaelLelu\\projects\\ratp'), ['projects', 'ratp']);
});

test('cd refuse un fichier et un dossier inexistant sans changer cwd', () => {
  assert.equal(executeCommand('cd README.md', ctx()).effects, undefined);
  assert.equal(executeCommand('cd inexistant', ctx()).effects, undefined);
});

test('cat lit le bon fichier du bon projet', () => {
  assert.match(texts('cat README.md', ['projects', 'ratp']), /MultiPartyLookup/);
  assert.doesNotMatch(texts('cat README.md', ['projects', 'ratp']), /ImageViewer/);
  assert.match(texts('cat README.md', ['projects', 'made-in-broke']), /ImageViewer/);
  assert.match(texts('cat stack.json', ['projects', 'ratp']), /Power BI/);
  assert.match(texts('cat ../INDEX.md', ['projects', 'ratp']), /# Projets/);
  assert.match(texts('cat skills.json'), /Dynamics 365/);
});

test('arborescence JSON cohérente et références résolues', () => {
  assert.ok(getDirectory(['projects', 'ha-pme']));
  assert.equal(getDirectory(['projects', 'ratp', 'README.md']), null);
  assert.ok(listNames(getDirectory(['about'])!).includes('parcours.txt'));
  assert.match(readFile(getFile(['projects', 'mediscreen', 'README.md'])!), /MongoDB/);
  assert.match(texts('tree', ['contact']), /links\.json/);
});

test('le changement de shell et clear retournent les effets attendus', () => {
  assert.deepEqual(executeCommand('shell bash', ctx()).effects, [{ type: 'shell', value: 'bash' }]);
  assert.deepEqual(executeCommand('clear', ctx()).effects, [{ type: 'clear' }]);
});
