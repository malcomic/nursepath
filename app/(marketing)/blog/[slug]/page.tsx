import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import JsonLd from '@/components/seo/JsonLd';
import { mdxComponents } from '@/components/blog/MdxComponents';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000';
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'NursePath',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NursePath',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };

  return (
    <main>
      <JsonLd data={blogJsonLd} />

      <article>
        <section className="bg-navy-800 py-16 text-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="mb-4 inline-block text-sm font-medium text-navy-200 hover:text-white"
            >
              ← Back to Blog
            </Link>
            <time className="text-sm text-navy-300" dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-xl leading-relaxed text-navy-200">{post.description}</p>
            )}
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-headings:font-bold prose-a:text-primary-600">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </section>
      </article>
    </main>
  );
}
