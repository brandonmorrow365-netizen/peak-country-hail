import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://peakcountryhail.com',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough', inspectorPort: false }),
  session: false,
  // Dynamic routes use src/pages/sitemap.xml.ts so noindex pages are excluded.
  trailingSlash: 'always',
});
