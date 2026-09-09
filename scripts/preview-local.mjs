import { dev } from 'astro';

// Keep one foreground preview with an independent optimizer cache. This avoids
// Astro's agent-mode background lock reusing yesterday's server configuration.
await dev({
  server: { host: '127.0.0.1', port: Number(process.env.PREVIEW_PORT || 45124) },
  vite: {
    cacheDir: '.astro/vite-private-header-dev',
    server: { strictPort: true, watch: { usePolling: true, interval: 300 } },
  },
});
