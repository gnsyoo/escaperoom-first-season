import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const destination=resolve('dist/art');
if (!existsSync('dist/index.html')) throw new Error('Build the web app first.');
mkdirSync(destination,{recursive:true});
for (const folder of ['backgrounds','states','items','characters','puzzles','title','map','story','ui','overlays','fonts']) {
  cpSync(resolve('art/production/v01',folder),resolve(destination,folder),{recursive:true});
}
cpSync(resolve('art/production/v01/gallery.html'),resolve(destination,'gallery.html'));
if (existsSync('art/ui-screens/v02/gallery.html')) cpSync(resolve('art/ui-screens/v02'),resolve(destination,'ui-screens/v02'),{recursive:true});
if (existsSync('art/ui-screens/season-v01/gallery.html')) cpSync(resolve('art/ui-screens/season-v01'),resolve(destination,'ui-screens/season-v01'),{recursive:true});
console.log('Preserved PNG/SVG pack copied to dist/art.');
