import { access, cp, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'docs');
const output = resolve(root, 'out');
const required = ['CNAME', 'index.html', 'roam.css', 'fonts/alfa-slab-one.woff2', 'fonts/inter-latin.woff2', 'templates.js', 'app.js', 'samples.html', 'samples.css', 'samples.js', 'sw.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

for (const file of required) await access(resolve(source, file));
new Function(await readFile(resolve(source, 'templates.js'), 'utf8'));
new Function(await readFile(resolve(source, 'app.js'), 'utf8'));
new Function(await readFile(resolve(source, 'samples.js'), 'utf8'));
JSON.parse(await readFile(resolve(source, 'manifest.webmanifest'), 'utf8'));
await rm(output, { recursive: true, force: true });
await cp(source, output, { recursive: true });
console.log(`ActiveShot static build complete: ${required.length} required assets verified.`);
