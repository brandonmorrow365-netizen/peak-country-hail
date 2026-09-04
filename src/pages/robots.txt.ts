import type {APIRoute} from 'astro';
import {env} from 'cloudflare:workers';
export const GET:APIRoute=()=>new Response(env.SITE_STAGE==='production'?'User-agent: *\nAllow: /\nSitemap: https://peakcountryhail.com/sitemap.xml\n':'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
