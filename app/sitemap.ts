import type { MetadataRoute } from 'next';
import { guideService } from '@/lib/services/guideService';
import { categoryService } from '@/lib/services/categoryService';
import { getAllSlugs } from '@/lib/blog';
import { slugify } from '@/lib/slugify';

const baseUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000';

const staticRoutes = [
  '',
  '/services',
  '/pricing',
  '/about',
  '/contact',
  '/reviews',
  '/blog',
  '/privacy',
  '/terms',
  '/refund',
  '/help',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  const [guides, categories, blogSlugs] = await Promise.all([
    guideService.getAllGuides(),
    categoryService.getAllCategories(),
    Promise.resolve(getAllSlugs()),
  ]);

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.id}`,
    lastModified: guide.updatedAt ? new Date(guide.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${slugify(category.name)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...pages, ...guidePages, ...categoryPages, ...blogPages];
}
