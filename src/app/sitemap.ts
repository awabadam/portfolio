import { MetadataRoute } from 'next'
import { getAllProjects } from '@/data/projects'
import { getAllBlogPosts } from '@/data/blog'
import { locales, defaultLocale } from '@/i18n/config'
import { getCaseStudy } from '@/data/case-studies'
import { BRAND_WORK, getBrandStudy } from '@/data/brand-studies'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.awab.design'

  function localeUrl(path: string, locale: string) {
    if (locale === defaultLocale) return `${baseUrl}${path}`
    return `${baseUrl}/${locale}${path}`
  }

  function withAlternates(path: string, opts: { changeFrequency: 'weekly' | 'monthly' | 'daily'; priority: number; lastModified?: Date; images?: string[] }) {
    return locales.map((locale) => ({
      url: localeUrl(path, locale),
      lastModified: opts.lastModified ?? new Date('2026-10-17'),
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      ...(opts.images?.length ? { images: opts.images } : {}),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, localeUrl(path, l)])),
          'x-default': localeUrl(path, defaultLocale),
        },
      },
    }))
  }

  const staticPages = [
    ...withAlternates('', { changeFrequency: 'weekly', priority: 1.0 }),
    ...withAlternates('/about', { changeFrequency: 'monthly', priority: 0.8 }),
    ...withAlternates('/projects', { changeFrequency: 'weekly', priority: 0.8 }),
    ...withAlternates('/services', { changeFrequency: 'monthly', priority: 0.8 }),
    ...withAlternates('/pricing', { changeFrequency: 'monthly', priority: 0.8 }),
    ...withAlternates('/contact', { changeFrequency: 'monthly', priority: 0.7 }),
    ...withAlternates('/audit', { changeFrequency: 'monthly', priority: 0.9 }),
    ...withAlternates('/blog', { changeFrequency: 'weekly', priority: 0.8 }),
    ...['webdesign-istanbul', 'website-maintenance', 'clinic-branding'].flatMap(
      slug => withAlternates(`/services/${slug}`, { changeFrequency: 'monthly', priority: 0.8 })
    ),
  ]

  try {
    const [projects, blogPosts] = await Promise.all([
      getAllProjects(),
      getAllBlogPosts()
    ])

    // Brand work may have no database rows, so add its ids from code.
    const projectIds = [...new Set([...projects.map((p) => p.id), ...BRAND_WORK])]

    const projectPages = projectIds.flatMap((id) =>
      withAlternates(`/projects/${id}`, {
        changeFrequency: 'monthly',
        priority: 0.7,
        // Image sitemap: the card thumbnail plus the case-study gallery (or
        // brand boards), so Google Images ties these images to awab.design.
        images: [
          `${baseUrl}/img/projects/${id}-thumbnail.webp`,
          ...(getCaseStudy(id)?.gallery ?? []).map((g) => `${baseUrl}${g.src}`),
          ...(getBrandStudy(id)?.boards ?? []).map((b) => `${baseUrl}${b.src}`),
        ],
      })
    )

    const blogPages = blogPosts.flatMap((post) =>
      locales.map((locale) => ({
        url: localeUrl(`/blog/${post.slug}`, locale),
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, localeUrl(`/blog/${post.slug}`, l)])),
            'x-default': localeUrl(`/blog/${post.slug}`, defaultLocale),
          },
        },
      }))
    )

    return [...staticPages, ...projectPages, ...blogPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
