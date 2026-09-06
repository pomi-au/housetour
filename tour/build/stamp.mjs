// Appends a fresh ?v= stamp to the tour's script and style links so browsers never serve a stale cached build.
import { readFileSync, writeFileSync } from 'node:fs';
const path = new URL('../../tour.html', import.meta.url);
const stamp = Date.now().toString(36);
let html = readFileSync(path, 'utf8');
html = html.replace(/(href="|src=")(tour\/(?:js|css)\/[\w.-]+\.(?:js|css))(\?v=[\w]+)?/g, `$1$2?v=${stamp}`);
writeFileSync(path, html);
// GitHub Pages serves index.html: keep it an exact copy of the tour page.
writeFileSync(new URL('../../index.html', import.meta.url), html);
console.log('stamped tour.html and index.html with', stamp);
