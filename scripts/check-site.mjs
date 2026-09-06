import assert from 'node:assert/strict';
import {pages} from '../src/data/pages.ts';
import {site} from '../src/data/site.ts';
const base=process.env.CHECK_URL||'http://127.0.0.1:4321';
const paths=['/','/contact/','/free-hail-inspection/','/hail-tracker/',...pages.map(p=>`/${p.slug}/`)];
const major=new Set(['/','/auto-hail-repair/','/paintless-dent-repair/','/door-ding-repair/','/repair-standards/','/northern-colorado-hail-history/','/hail-tracker/greeley/','/hail-tracker/weld-county/','/hail-tracker/northern-colorado/','/faq/','/service-area/','/hail-size-guide/','/after-a-hailstorm/','/data-sources/']);
for(const path of paths){
 const r=await fetch(base+path);assert.equal(r.status,200,path);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow',path+' preview X-Robots-Tag');const html=await r.text();
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path+' h1');assert.ok(html.includes('https://peakcountryhail.com'+path),path+' canonical');assert.ok(html.includes('noindex, nofollow'),path+' preview indexing');
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||'';assert.ok(!/localhost|127\.0\.0\.1|workers\.dev/.test(canonical),path+' canonical host');
 assert.ok(!/href="#"/.test(html),path+' placeholder link');assert.ok(!/workers\.dev/.test(html),path+' hard-coded preview URL');
 for(const href of html.matchAll(/href="(tel:|sms:)([^"]+)"/g))assert.equal(href[2],site.phone,path+' contact number');
 for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs))JSON.parse(m[1]);
 for(const m of html.matchAll(/href="(\/[^"#]*)"/g)){const href=m[1];if(!href.startsWith('/_astro/')&&!paths.includes(href)){const linked=await fetch(base+href);assert.ok(linked.ok,`${path} broken internal link ${href}`);}}
 if(major.has(path)){const title=html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim()||'',description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'';assert.ok(title.length>=35&&title.length<=65,`${path} title length ${title.length}`);assert.ok(description.length>=120&&description.length<=165,`${path} description length ${description.length}`);}
}
assert.equal((await fetch(base+'/not-a-page/')).status,404);assert.match(await(await fetch(base+'/robots.txt')).text(),/Disallow: \//);
const xml=await(await fetch(base+'/sitemap.xml')).text();for(const p of pages.filter(p=>p.noindex))assert.ok(!xml.includes(`/${p.slug}/`));assert.ok(!/localhost|127\.0\.0\.1|workers\.dev|northerncoloradohail\.com|coloradohailtracker\.com|greeleyhail\.com|peakcountrypdr\.com|weldcountyhail\.com/.test(xml));for(const loc of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.ok(loc[1].startsWith('https://peakcountryhail.com/'));
assert.equal((await fetch(base+'/contact/',{method:'POST',headers:{Origin:base,'Content-Type':'application/x-www-form-urlencoded'},body:''})).status,503);
console.log(`Validated ${paths.length} pages, metadata lengths, CTAs, canonical tags, structured data, links, preview noindex, sitemap, 404, and disabled forms.`);
