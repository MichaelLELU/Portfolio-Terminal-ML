import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolio } from '../data';
import { getFile, getDirectory, readFile } from './fileSystem';

test('chaque projet éditorial a son propre dossier et ses contenus', () => {
  const slugs = portfolio.projects.map(p => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const project of portfolio.projects) {
    assert.ok(project.stack.length > 0 && project.highlights.length > 0);
    assert.ok(getDirectory(['projects', project.slug]));
    const readme = getFile(['projects', project.slug, 'README.md']);
    const stack = getFile(['projects', project.slug, 'stack.json']);
    assert.ok(readme);
    assert.ok(stack);
    assert.match(readFile(readme!), new RegExp(project.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.deepEqual(JSON.parse(readFile(stack!)).stack, project.stack);
  }
});

test('chaque catégorie de compétences est exposée dans le système de fichiers', () => {
  const root = getDirectory(['skills']);
  assert.ok(root);
  const represented = root!.children.filter(n => n.type === 'file' && n.source.startsWith('skill:'));
  assert.deepEqual(new Set(represented.map(n => n.type === 'file' ? n.source.slice(6) : '')), new Set(Object.keys(portfolio.skills)));
});
