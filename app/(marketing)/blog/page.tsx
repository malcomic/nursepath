import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Nursing exam prep tips, NCLEX study strategies, and resources for nursing students from NursePath.',
  openGraph: {
    title: 'NursePath Blog — NCLEX & Nursing Exam Prep Tips',
    description:
      'Nursing exam prep tips, NCLEX study strategies, and resources for nursing students from NursePath.',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main>
      <section className="bg-navy-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            NursePath Blog
          </h1>
          <p className="max-w-2xl text-xl text-navy-200">
            Study tips, exam strategies, and nursing school advice from our team of educators.
          </p>
        </div>
      </section>

      <section className="bg-soft py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-navy-400">No blog posts yet. Check back soon!</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-lg"
                >
                  <time className="text-sm text-navy-400" dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="mt-2 mb-3 font-display text-2xl font-bold text-navy-800">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.description && (
                    <p className="text-gray-600 leading-relaxed mb-4">{post.description}</p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
