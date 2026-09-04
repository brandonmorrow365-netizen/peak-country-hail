/// <reference types="astro/client" />
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    SITE_STAGE?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    FORMS_ENABLED?: string;
    WEATHER_ENABLED?: string;
  }
}
