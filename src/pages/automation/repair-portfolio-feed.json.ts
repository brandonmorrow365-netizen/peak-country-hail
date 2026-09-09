import type { APIRoute } from 'astro';
import { galleryImage, portfolioRepairs } from '../../data/gallery.ts';
import { site } from '../../data/site.ts';

export const GET: APIRoute = () => {
  const feed = {
    business: site.name,
    website: site.url,
    generatedAt: '2026-09-09T20:21:14Z',
    repairs: portfolioRepairs.map((repair) => ({
      repairId: repair.repairId,
      displayName: repair.vehicle,
      historical: true,
      galleryUrl: `${site.url}/gallery/#${repair.slug}`,
      serviceType: 'Paintless Dent Repair',
      description: repair.summary,
      images: repair.photos.map((photo) => ({
        imageId: `${repair.repairId}:${photo.state}:${photo.angle}`,
        role: photo.state,
        angle: photo.angle,
        publicUrl: new URL(galleryImage(repair, photo, 1200, 'webp'), site.url).href,
        altText: photo.alt,
      })),
    })),
  };

  return new Response(JSON.stringify(feed, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
