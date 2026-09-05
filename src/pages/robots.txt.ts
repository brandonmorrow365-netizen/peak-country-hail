import type {APIRoute} from 'astro';
import {env} from 'cloudflare:workers';
import {site} from '../data/site';
export const GET:APIRoute=()=>new Response(env.SITE_STAGE==='production'?`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
