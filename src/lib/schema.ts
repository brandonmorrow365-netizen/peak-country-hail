import { site } from '../data/site.ts';
import { contentByPath } from '../data/contentMeta.ts';

export type SchemaNode = Record<string, unknown>;

export const schemaIds = {
  business: `${site.url}/#business`,
  website: `${site.url}/#website`,
};

const absolute = (path: string) => new URL(path, `${site.url}/`).href;

function titleCase(segment: string) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function businessNode(): SchemaNode {
  return {
    '@type': 'AutoRepair',
    '@id': schemaIds.business,
    name: site.name,
    url: `${site.url}/`,
    telephone: site.phone,
    email: site.email,
    logo: { '@type': 'ImageObject', '@id': `${site.url}/#logo`, url: absolute(site.logo), contentUrl: absolute(site.logo), caption: site.name },
    image: { '@id': `${site.url}/#logo` },
    description: `${site.experience}. Mobile auto hail repair and paintless dent repair by appointment in ${site.serviceRegion}.`,
    areaServed: [
      ...site.approvedCommunities.map((name) => ({ '@type': 'City', name: `${name}, Colorado` })),
      { '@type': 'AdministrativeArea', name: 'Weld County, Colorado' },
      { '@type': 'Place', name: 'Northern Colorado' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vehicle dent repair services',
      itemListElement: site.primaryServices.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
    },
    knowsAbout: ['Automotive hail damage', 'Paintless Dent Repair', 'Door ding repair', 'Minor dent repair', 'Crease repair', 'Hail-damage inspection', 'Vehicle repair planning'],
    ...(site.socialProfiles.length ? { sameAs: site.socialProfiles } : {}),
  };
}

export function websiteNode(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': schemaIds.website,
    url: `${site.url}/`,
    name: site.name,
    publisher: { '@id': schemaIds.business },
    inLanguage: 'en-US',
  };
}

export function webPageNode(pathname: string, name: string, description: string): SchemaNode {
  const url = absolute(pathname);
  const lastmod = contentByPath.get(pathname as `/${string}`)?.lastmod;
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': schemaIds.website },
    about: { '@id': schemaIds.business },
    publisher: { '@id': schemaIds.business },
    inLanguage: 'en-US',
    ...(lastmod ? { dateModified: lastmod } : {}),
  };
}

export function breadcrumbNode(pathname: string, pageName: string): SchemaNode | null {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return null;
  const items: SchemaNode[] = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` }];
  let path = '';
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    items.push({ '@type': 'ListItem', position: index + 2, name: index === segments.length - 1 ? pageName : titleCase(segment), item: absolute(`${path}/`) });
  });
  return { '@type': 'BreadcrumbList', '@id': `${absolute(pathname)}#breadcrumb`, itemListElement: items };
}

export function schemaNodes(value?: SchemaNode | null): SchemaNode[] {
  if (!value) return [];
  if (Array.isArray(value['@graph'])) return value['@graph'] as SchemaNode[];
  const { ['@context']: _context, ...node } = value;
  return [node];
}

export function articleNode(pathname: string, headline: string, description: string, published: string, modified: string): SchemaNode {
  const url = absolute(pathname);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    author: { '@id': schemaIds.business },
    publisher: { '@id': schemaIds.business },
    image: { '@id': `${site.url}/#logo` },
    datePublished: published,
    dateModified: modified,
    inLanguage: 'en-US',
  };
}

export function pageGraph(pathname: string, name: string, description: string, pageSchema?: SchemaNode | null) {
  const breadcrumb = breadcrumbNode(pathname, name);
  const nodes = [businessNode(), websiteNode(), webPageNode(pathname, name, description), ...(breadcrumb ? [breadcrumb] : []), ...schemaNodes(pageSchema)];
  const seen = new Set<string>();
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node) => {
      const id = typeof node['@id'] === 'string' ? node['@id'] : '';
      if (!id || !seen.has(id)) { if (id) seen.add(id); return true; }
      return false;
    }),
  };
}
