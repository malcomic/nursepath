import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Nursing exam prep tips, NCLEX study strategies, and resources for nursing students from NursePath.',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main>
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">NursePath Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Study tips, exam strategies, and nursing school advice from our team of educators.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-gray-600 text-center">No blog posts yet. Check back soon!</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
                >
                  <time className="text-sm text-gray-500" dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
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
