'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { ArticleCard } from './article-card';

interface Article {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  readingTime?: string;
  tags?: string[];
}

interface ArticleCardWithCommentsProps {
  article: Article;
}

export function ArticleCardWithComments({ article }: ArticleCardWithCommentsProps) {
  const { data: commentCount } = useQuery({
    queryKey: ['comment.getCount', article.slug],
    queryFn: () => trpc.comment.getCount.query({ slug: article.slug }),
  });

  return <ArticleCard article={article} commentCount={commentCount} />;
}
