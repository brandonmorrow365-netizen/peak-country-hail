import type {APIRoute} from 'astro';
import {env} from 'cloudflare:workers';
import {robotsText} from '../lib/seo';
export const GET:APIRoute=()=>new Response(robotsText(env.SITE_STAGE),{headers:{'Content-Type':'text/plain; charset=utf-8'}});
