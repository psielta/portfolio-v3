import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface Article {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  content: string;
  readingTime: string;
  tags?: string[];
  featured?: boolean;
}

const articlesDirectory = path.join(process.cwd(), 'src/content/blog');

// Função para obter todos os slugs de artigos
export function getArticleSlugs(): string[] {
  try {
    const files = fs.readdirSync(articlesDirectory);
    return files
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map((file) => file.replace(/\.(mdx|md)$/, ''));
  } catch (error) {
    console.error('Erro ao ler diretório de artigos:', error);
    return [];
  }
}

// Função para obter um artigo por slug
export function getArticleBySlug(slug: string): Article | null {
  try {
    // Tenta primeiro .mdx, depois .md
    let fullPath = path.join(articlesDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(articlesDirectory, `${slug}.md`);
      if (!fs.existsSync(fullPath)) {
        console.error(`Artigo não encontrado: ${slug}`);
        return null;
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Calcula o tempo de leitura
    const stats = readingTime(content);

    // Retorna o artigo com todos os metadados
    return {
      slug,
      title: data.title || 'Sem título',
      description: data.description || '',
      author: data.author || 'Mateus Salgueiro',
      publishedAt: data.publishedAt || data.date || new Date().toISOString(),
      content,
      readingTime: stats.text,
      tags: data.tags || [],
      featured: data.featured || false,
    };
  } catch (error) {
    console.error(`Erro ao ler artigo ${slug}:`, error);
    return null;
  }
}

// Função para obter todos os artigos
export function getAllArticles(): Article[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      // Ordena por data de publicação (mais recente primeiro)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return articles;
}

// Função para obter artigos em destaque
export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter((article) => article.featured);
}

// Função para obter artigos por tag
export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((article) =>
    article.tags?.includes(tag)
  );
}

// Função para obter todas as tags únicas
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tagsSet = new Set<string>();

  articles.forEach((article) => {
    article.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

// Função para obter artigos relacionados
export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const article = getArticleBySlug(slug);
  if (!article) return [];

  const allArticles = getAllArticles().filter((a) => a.slug !== slug);

  // Encontra artigos com tags em comum
  const relatedArticles = allArticles
    .map((a) => {
      const commonTags = a.tags?.filter((tag) => article.tags?.includes(tag)) || [];
      return { article: a, score: commonTags.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);

  // Se não houver artigos relacionados suficientes, preenche com os mais recentes
  if (relatedArticles.length < limit) {
    const remainingArticles = allArticles
      .filter((a) => !relatedArticles.some((r) => r.slug === a.slug))
      .slice(0, limit - relatedArticles.length);

    relatedArticles.push(...remainingArticles);
  }

  return relatedArticles;
}