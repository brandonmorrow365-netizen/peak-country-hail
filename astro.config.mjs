import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://peakcountryhail.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [sitemap()],
  trailingSlash: 'always',
});
