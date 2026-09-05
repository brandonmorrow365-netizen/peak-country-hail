import assert from 'node:assert/strict';
import {pages} from '../src/data/pages.ts';
const base=process.env.CHECK_URL||'http://127.0.0.1:4321';
const paths=['/','/contact/','/free-hail-inspection/','/hail-tracker/',...pages.map(p=>`/${p.slug}/`)];
for(const path of paths){const r=await fetch(base+path);assert.equal(r.status,200,path);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow',path+' preview X-Robots-Tag');const html=await r.text();assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path+' h1');assert.ok(html.includes('https://peakcountryhail.com'+path),path+' canonical');assert.ok(html.includes('noindex, nofollow'),path+' preview indexing');assert.ok(!/localhost|127\.0\.0\.1|workers\.dev/.test(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||''),path+' canonical host');for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))JSON.parse(m[1]);for(const m of html.matchAll(/href="(\/[^"#]*)"/g)){const href=m[1];if(!href.startsWith('/_astro/')&&!paths.includes(href)){const linked=await fetch(base+href);assert.ok(linked.ok,`${path} broken internal link ${href}`);}}}
assert.equal((await fetch(base+'/not-a-page/')).status,404);
assert.match(await(await fetch(base+'/robots.txt')).text(),/Disallow: \//);
const xml=await(await fetch(base+'/sitemap.xml')).text();for(const p of pages.filter(p=>p.noindex))assert.ok(!xml.includes(`/${p.slug}/`));assert.ok(!/localhost|127\.0\.0\.1|workers\.dev|northerncoloradohail\.com|coloradohailtracker\.com|greeleyhail\.com|peakcountrypdr\.com|weldcountyhail\.com/.test(xml));for(const loc of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.ok(loc[1].startsWith('https://peakcountryhail.com/'));
assert.equal((await fetch(base+'/contact/',{method:'POST',headers:{Origin:base,'Content-Type':'application/x-www-form-urlencoded'},body:''})).status,503);
console.log(`Validated ${paths.length} pages, canonical tags, structured data, links, noindex, sitemap, 404, and disabled forms.`);
