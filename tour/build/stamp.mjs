// Appends a fresh ?v= stamp to each page's script and style links so browsers never serve a stale cached build.
import { readFileSync, writeFileSync } from 'node:fs';
const stamp = Date.now().toString(36);
const stampPage = (name) => {
  const path = new URL(`../../${name}`, import.meta.url);
  let html = readFileSync(path, 'utf8');
  html = html.replace(/(href="|src=")(tour\/(?:js|css)\/[\w.-]+\.(?:js|css))(\?v=[\w]+)?/g, `$1$2?v=${stamp}`);
  writeFileSync(path, html);
  return html;
};
const tour = stampPage('tour.html');
stampPage('model.html');
// GitHub Pages serves index.html: keep it an exact copy of the tour page.
writeFileSync(new URL('../../index.html', import.meta.url), tour);
console.log('stamped tour.html, index.html and model.html with', stamp);
