import type { Metadata } from 'next';
import { BlogContent } from '@/components/blog/blog-content';
import { getAllArticles, getFeaturedArticles, getAllTags } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Mateus Salgueiro',
  description: 'Artigos sobre desenvolvimento web, tecnologia, programação e experiências no mundo do software.',
};

export default function BlogPage() {
  const articles = getAllArticles();
  const featuredArticles = getFeaturedArticles();
  const tags = getAllTags();

  return (
    <BlogContent
      articles={articles}
      featuredArticles={featuredArticles}
      tags={tags}
    />
  );
}