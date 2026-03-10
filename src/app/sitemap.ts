import { MetadataRoute } from 'next';
import { toolRegistry } from '@/lib/config/toolRegistry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://editing.biz.id';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
  
  // Tool pages
  const toolPages: MetadataRoute.Sitemap = toolRegistry.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  return [...staticPages, ...toolPages];
}
