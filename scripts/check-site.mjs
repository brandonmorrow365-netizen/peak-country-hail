import assert from 'node:assert/strict';
import {pages} from '../src/data/pages.ts';
const base=process.env.CHECK_URL||'http://127.0.0.1:4321';
const paths=['/','/contact/','/free-hail-inspection/','/hail-tracker/',...pages.map(p=>`/${p.slug}/`)];
for(const path of paths){const r=await fetch(base+path);assert.equal(r.status,200,path);const html=await r.text();assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path+' h1');assert.ok(html.includes('https://peakcountryhail.com'+path),path+' canonical');assert.ok(html.includes('noindex'),path+' preview indexing');for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))JSON.parse(m[1]);for(const m of html.matchAll(/href="(\/[^"#]*)"/g)){const href=m[1];if(!href.startsWith('/_astro/'))assert.ok(paths.includes(href),`${path} broken internal link ${href}`);}}
assert.equal((await fetch(base+'/not-a-page/')).status,404);
assert.match(await(await fetch(base+'/robots.txt')).text(),/Disallow: \//);
const xml=await(await fetch(base+'/sitemap.xml')).text();for(const p of pages.filter(p=>p.noindex))assert.ok(!xml.includes(`/${p.slug}/`));
assert.equal((await fetch(base+'/contact/',{method:'POST',headers:{Origin:base,'Content-Type':'application/x-www-form-urlencoded'},body:''})).status,503);
console.log(`Validated ${paths.length} pages, canonical tags, structured data, links, noindex, sitemap, 404, and disabled forms.`);
