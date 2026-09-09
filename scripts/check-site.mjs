import assert from 'node:assert/strict';
import {pages} from '../src/data/pages.ts';
import {site} from '../src/data/site.ts';
import {contentMeta} from '../src/data/contentMeta.ts';
const base=process.env.CHECK_URL||'http://127.0.0.1:4321';
const paths=['/','/contact/','/free-hail-inspection/','/hail-tracker/',...pages.map(p=>`/${p.slug}/`)];
const major=new Set(['/','/auto-hail-repair/','/paintless-dent-repair/','/door-ding-repair/','/repair-standards/','/northern-colorado-hail-history/','/hail-tracker/greeley/','/hail-tracker/weld-county/','/hail-tracker/northern-colorado/','/faq/','/service-area/','/hail-size-guide/','/after-a-hailstorm/','/data-sources/']);
let homeSchemas=[];const titles=new Map(),descriptions=new Map(),canonicals=new Set();
for(const path of paths){
 const r=await fetch(base+path);assert.equal(r.status,200,path);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow',path+' preview X-Robots-Tag');const html=await r.text();
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,path+' h1');assert.ok(html.includes('https://peakcountryhail.com'+path),path+' canonical');assert.ok(html.includes('noindex, nofollow'),path+' preview indexing');
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||'';assert.ok(!/localhost|127\.0\.0\.1|workers\.dev/.test(canonical),path+' canonical host');
 assert.ok(!canonicals.has(canonical),path+' duplicate canonical');canonicals.add(canonical);
 assert.ok(!/href="#"/.test(html),path+' placeholder link');assert.ok(!/workers\.dev/.test(html),path+' hard-coded preview URL');
 for(const href of html.matchAll(/href="(tel:|sms:)([^"]+)"/g))assert.equal(href[2],site.phone,path+' contact number');
 const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
 if(path==='/')homeSchemas=schemas;
 for(const m of html.matchAll(/href="(\/[^"#]*)"/g)){const href=m[1];if(!href.startsWith('/_astro/')&&!paths.includes(href)){const linked=await fetch(base+href);assert.ok(linked.ok,`${path} broken internal link ${href}`);}}
 if(major.has(path)){const title=html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim()||'',description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'';assert.ok(title.length>=35&&title.length<=65,`${path} title length ${title.length}`);assert.ok(description.length>=120&&description.length<=165,`${path} description length ${description.length}`);assert.ok(!titles.has(title),`${path} duplicate title with ${titles.get(title)}`);assert.ok(!descriptions.has(description),`${path} duplicate description with ${descriptions.get(description)}`);titles.set(title,path);descriptions.set(description,path);}
}
const homeNodes=homeSchemas.flatMap(schema=>schema['@graph']??[schema]);
const business=homeNodes.find(schema=>schema['@id']===site.url+'/#business');
const website=homeNodes.find(schema=>schema['@id']===site.url+'/#website');
assert.equal(business?.['@type'],'AutoRepair','homepage business schema');
assert.equal(business?.name,site.name,'homepage business name');
assert.equal(business?.telephone,site.phone,'homepage business phone');
assert.ok(!business?.address&&!business?.geo,'service-area business must not expose an address or private coordinates');
assert.equal(website?.['@type'],'WebSite','homepage WebSite schema');
assert.equal(website?.publisher?.['@id'],site.url+'/#business','WebSite publisher relationship');
assert.deepEqual(business?.areaServed?.filter(area=>area['@type']==='City').map(area=>area.name),site.approvedCommunities.map(name=>`${name}, Colorado`),'approved service areas in schema');
assert.equal((await fetch(base+'/not-a-page/')).status,404);assert.equal((await fetch(base+'/case-studies/sample-do-not-publish/')).status,404);assert.equal((await fetch(base+'/locations/greeley/')).status,404);assert.match(await(await fetch(base+'/robots.txt')).text(),/Disallow: \//);
const xml=await(await fetch(base+'/sitemap.xml')).text();for(const p of pages.filter(p=>p.noindex))assert.ok(!xml.includes(`/${p.slug}/`));assert.ok(!/localhost|127\.0\.0\.1|workers\.dev|northerncoloradohail\.com|coloradohailtracker\.com|greeleyhail\.com|peakcountrypdr\.com|weldcountyhail\.com|sample-do-not-publish|\/locations\//.test(xml));const sitemapLocs=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);assert.equal(sitemapLocs.length,contentMeta.length);for(const entry of contentMeta){assert.ok(xml.includes(`<loc>${new URL(entry.path,site.url).href}</loc><lastmod>${entry.lastmod}</lastmod>`),entry.path+' sitemap metadata');}
const feed=await(await fetch(base+'/feed.xml')).text();assert.match(feed,/^<\?xml/);assert.match(feed,/<rss version="2\.0">/);assert.ok(!/sample-do-not-publish|workers\.dev|localhost/.test(feed));for(const entry of contentMeta.filter(entry=>entry.feed))assert.ok(feed.includes(new URL(entry.path,site.url).href),entry.path+' feed entry');
assert.equal((await fetch(base+'/contact/',{method:'POST',headers:{Origin:base,'Content-Type':'application/x-www-form-urlencoded'},body:''})).status,503);
console.log(`Validated ${paths.length} pages, metadata lengths, CTAs, canonical tags, structured data, links, preview noindex, sitemap, 404, and disabled forms.`);
