import { handle } from '@astrojs/cloudflare/handler';
import { ingestWeather } from './lib/weather';
export default {
  async fetch(request, env, ctx) {
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
