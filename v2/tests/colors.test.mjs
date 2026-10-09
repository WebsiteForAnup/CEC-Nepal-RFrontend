import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url));
async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.(css|ts|tsx)$/.test(file) ? [file] : [];
  }))).flat();
}

test('component colors use the root palette and semantic names', async () => {
  const files = await sourceFiles(sourceRoot);
  const sources = await Promise.all(files.map(async file => ({ file, text: await readFile(file, 'utf8') })));
  const palette = sources.find(({ file }) => path.basename(file) === 'color.css');
  const tokens = [...palette.text.matchAll(/(--cec-[\w-]+)\s*:/g)].map(match => match[1]);
  assert.equal(new Set(tokens).size, tokens.length, 'palette has duplicate token names');
  for (const token of tokens) assert.match(token, /^--cec-(background|text|border|shadow|focus|color)-/, 'token must start with its purpose: ' + token);
  for (const { file, text } of sources) {
    if (path.basename(file) === 'color.css') continue;
    assert.doesNotMatch(text, /#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i, file + ' contains a literal color');
    assert.doesNotMatch(text, /--(?:cec-)?(?:blue|lime|navy|white|bg-white)\b|cec-[\w-]*(?:blue|lime)\b/i, file + ' uses a color-based name');
  }
  const declarations = new Set(sources.flatMap(({ text }) => [...text.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1])));
  for (const { file, text } of sources) {
    for (const match of text.matchAll(/var\((--cec-[\w-]+)/g)) assert.ok(declarations.has(match[1]), file + ' references an undefined token ' + match[1]);
  }
});
