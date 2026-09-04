import type {APIRoute} from 'astro';
import {pages} from '../data/pages';
import {site} from '../data/site';
export const GET:APIRoute=()=>new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['','contact','free-hail-inspection','hail-tracker',...pages.filter(p=>!p.noindex).map(p=>p.slug)].map(s=>'<url><loc>'+site.url+'/'+(s?s+'/':'')+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});
