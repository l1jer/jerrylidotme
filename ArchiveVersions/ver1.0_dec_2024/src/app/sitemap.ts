import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/seo'

// The portfolio is a single page. The 3D lab, archived client sites and earlier versions are
// deliberately left out: they are marked noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
