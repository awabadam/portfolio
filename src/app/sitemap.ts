import { MetadataRoute } from 'next'
import { getAllProjects } from '@/data/projects'
import { getAllBlogPosts } from '@/data/blog'
import { locales, defaultLocale } from '@/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://awab.design'

  function localeUrl(path: string, locale: string) {
    if (locale === defaultLocale) return `${baseUrl}${path}`
    return `${baseUrl}/${locale}${path}`
  }

  function withAlternates(path: string, opts: { changeFrequency: 'weekly' | 'monthly' | 'daily'; priority: number }) {
    return locales.map((locale) => ({
      url: localeUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, localeUrl(path, l)])
        ),
      },
    }))
  }

  const staticPages = [
    ...withAlternates('', { changeFrequency: 'weekly', priority: 1.0 }),
    ...withAlternates('/webdesign-istanbul', { changeFrequency: 'weekly', priority: 0.9 }),
...withAlternates('/about', { changeFrequency: 'monthly', priority: 0.8 }),
    ...withAlternates('/projects', { changeFrequency: 'weekly', priority: 0.8 }),
    ...withAlternates('/services', { changeFrequency: 'monthly', priority: 0.8 }),
    ...withAlternates('/contact', { changeFrequency: 'monthly', priority: 0.7 }),
    ...withAlternates('/rate-calculator', { changeFrequency: 'weekly', priority: 0.8 }),
    ...withAlternates('/blog', { changeFrequency: 'weekly', priority: 0.8 }),
  ]

  try {
    const [projects, blogPosts] = await Promise.all([
      getAllProjects(),
      getAllBlogPosts()
    ])

    const projectPages = projects.flatMap((project) =>
      withAlternates(`/projects/${project.id}`, { changeFrequency: 'monthly', priority: 0.7 })
    )

    const blogPages = blogPosts.flatMap((post) =>
      locales.map((locale) => ({
        url: localeUrl(`/blog/${post.slug}`, locale),
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, localeUrl(`/blog/${post.slug}`, l)])
          ),
        },
      }))
    )

    return [...staticPages, ...projectPages, ...blogPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
