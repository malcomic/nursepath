import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  keywords?: string[];
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));
}

export function getAllPosts(): BlogPostMeta[] {
  const files = getMdxFiles();

  const posts: BlogPostMeta[] = [];

  for (const filename of files) {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
    const { data } = matter(raw);

    if (!data.title || !data.publishedAt) {
      continue;
    }

    posts.push({
      slug,
      title: data.title as string,
      description: (data.description as string) ?? '',
      publishedAt: data.publishedAt as string,
      keywords: data.keywords as string[] | undefined,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  if (!data.title || !data.publishedAt) {
    return null;
  }

  return {
    slug,
    title: data.title as string,
    description: (data.description as string) ?? '',
    publishedAt: data.publishedAt as string,
    keywords: data.keywords as string[] | undefined,
    content,
  };
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
