import type {APIRoute} from 'astro';
import {contentMeta} from '../data/contentMeta';
import {site} from '../data/site';
const escapeXml=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export const GET:APIRoute=()=>new Response(
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+
  contentMeta.map(({path,lastmod})=>`<url><loc>${escapeXml(new URL(path,site.url).href)}</loc><lastmod>${lastmod}</lastmod></url>`).join('')+
  '</urlset>',
  {headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}}
);
