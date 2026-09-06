/// <reference types="astro/client" />
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    SITE_STAGE?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    CONTACT_EMAIL?: SendEmail;
    CONTACT_EMAIL_RECIPIENT?: string;
    FORMS_ENABLED?: string;
    WEATHER_ENABLED?: string;
  }
}
