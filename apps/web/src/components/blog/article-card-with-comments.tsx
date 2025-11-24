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
  const { data: commentCount } = useQuery(
    trpc.comment.getCount.queryOptions({ slug: article.slug })
  );

  return <ArticleCard article={article} commentCount={commentCount} />;
}
