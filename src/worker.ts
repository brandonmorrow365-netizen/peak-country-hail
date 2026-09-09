import { handle } from '@astrojs/cloudflare/handler';
import { ingestWeather } from './lib/weather';
import { getCanonicalRedirect } from './lib/domain-routing';
export default {
  async fetch(request, env, ctx) {
    const redirect = getCanonicalRedirect(request.url);
    if (redirect) {
      return new Response(null, {
        status: 301,
        headers: {
          'Location': redirect,
          'Cache-Control': 'public, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
    const requestUrl = new URL(request.url);
    if (request.method === 'GET' && env.SITE_STAGE === 'production' && env.INDEXNOW_KEY && requestUrl.pathname === `/${env.INDEXNOW_KEY}.txt`) {
      return new Response(env.INDEXNOW_KEY, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' } });
    }
    const response = await handle(request, env, ctx);
    const headers = new Headers(response.headers);
    if (env.SITE_STAGE !== 'production') headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
  async scheduled(controller, env, ctx) {
    if (env.WEATHER_ENABLED === 'true' && env.DB) ctx.waitUntil(ingestWeather(env.DB, controller.scheduledTime));
  },
} satisfies ExportedHandler<Cloudflare.Env>;
