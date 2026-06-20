export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  demoUrl?: string;
  logo?: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
  highlight?: boolean;
  category?: string;
}

// Cores das linguagens de programação
const LANGUAGE_COLORS: Record<string, string> = {
  'C#': '#178600',
  'Pascal': '#E3F171',
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'PHP': '#4F5D95',
};

export const projects: Project[] = [
  {
    id: 'ra',
    name: 'Ra',
    description:
      'Portfolio de mídia com identidade egípcia: grava ou envia músicas e vídeos, acompanha a conversão em tempo real e reproduz no navegador via HLS. Pipeline assíncrono com Next.js, RabbitMQ, worker .NET/FFmpeg, Redis Pub/Sub e Nginx.',
    url: 'https://github.com/psielta/ra',
    demoUrl: 'https://ra.mateussalgueiro.com.br/',
    logo: '/projects/ra.svg',
    stars: 0,
    forks: 0,
    language: 'TypeScript / C#',
    languageColor: LANGUAGE_COLORS['TypeScript'],
    technologies: ['Next.js', 'React', 'Prisma', 'PostgreSQL', 'RabbitMQ', 'Redis', 'FFmpeg', '.NET 10', 'hls.js'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
    highlight: true,
    category: 'Full Stack',
  },
  {
    id: 'anubis',
    name: 'Anubis',
    description:
      'Biblioteca digital pessoal inspirada em plataformas de leitura: importa PDFs, organiza coleções, lê com progresso salvo e usa IA (Gemini) como companheiro de estudo — perguntas, resumos e flashcards em streaming.',
    url: 'https://github.com/psielta/anubis',
    demoUrl: 'https://mateussalgueiro.com.br/',
    logo: '/projects/anubis.svg',
    stars: 0,
    forks: 0,
    language: 'Python / TypeScript',
    languageColor: LANGUAGE_COLORS['Python'],
    technologies: ['FastAPI', 'Angular', 'PostgreSQL', 'MinIO', 'SQLAlchemy', 'Gemini API', 'JWT'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
    highlight: true,
    category: 'Full Stack',
  },
  {
    id: 'osiris',
    name: 'Osiris',
    description:
      'SaaS de finanças pessoais multi-tenant com domínio financeiro completo: contas, cartões, compras, faturas e contas a pagar. Web em ASP.NET Core MVC com HTMX e API JWT separada para o app mobile Kotlin Multiplatform.',
    url: 'https://github.com/psielta/osiris',
    demoUrl: 'https://osiris.mateussalgueiro.com.br/',
    logo: '/projects/osiris.svg',
    stars: 0,
    forks: 0,
    language: 'C#',
    languageColor: LANGUAGE_COLORS['C#'],
    technologies: ['ASP.NET Core', 'MediatR', 'EF Core', 'PostgreSQL', 'Tailwind CSS', 'HTMX', 'JWT API'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
    highlight: true,
    category: 'Full Stack',
  },
  {
    id: 'thoth',
    name: 'Thoth',
    description:
      'App desktop full-stack para organizar, versionar e acompanhar prompts em Markdown usados com agentes como Claude Code e Codex. Board Kanban, workflow por fases, terminais PowerShell integrados, Monaco Editor e assistente IA com Gemini.',
    url: 'https://github.com/psielta/thoth',
    logo: '/projects/thoth.svg',
    stars: 0,
    forks: 0,
    language: 'C# / TypeScript',
    languageColor: LANGUAGE_COLORS['C#'],
    technologies: ['ASP.NET Core', 'React', 'SignalR', 'PostgreSQL', 'TipTap', 'Monaco Editor', 'xterm.js', 'Gemini API'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
    highlight: true,
    category: 'Desktop',
  },
  {
    id: 'basicerp',
    name: 'BasicERP',
    description: 'Sistema ERP básico multi-tenant desenvolvido com ASP.NET MVC 5 e Entity Framework Core 3.1 utilizando PostgreSQL como banco de dados.',
    url: 'https://github.com/psielta/basicerp',
    stars: 0,
    forks: 0,
    language: 'C# / ASP.NET',
    languageColor: LANGUAGE_COLORS['C#'],
    technologies: ['C#', 'ASP.NET MVC 5', 'Razor (CSHTML)', 'JavaScript', 'HTML', 'CSS', 'Entity Framework Core 3.1', 'PostgreSQL'],
    createdAt: '2025-11-20T04:14:33Z',
    updatedAt: '2025-11-21T02:52:48Z',
    highlight: true,
    category: 'Full Stack',
  },
  {
    id: 'quast',
    name: 'QUAST',
    description: 'Sistema desktop desenvolvido em Delphi para auxiliar estudantes no gerenciamento e resolução de questões de provas e concursos.',
    url: 'https://github.com/psielta/QUAST',
    stars: 0,
    forks: 0,
    language: 'Pascal',
    languageColor: LANGUAGE_COLORS['Pascal'],
    technologies: ['Delphi', 'Pascal', 'Desktop'],
    createdAt: '2025-11-20T06:06:29Z',
    updatedAt: '2025-11-21T01:23:50Z',
    category: 'Desktop',
  },
  // Adicione novos projetos aqui seguindo a mesma estrutura
];

// Função helper para formatar data
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

// Função para obter projetos por categoria
export function getProjectsByCategory(category?: string): Project[] {
  if (!category) return projects;
  return projects.filter((p) => p.category === category);
}

// Função para obter projetos em destaque
export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.highlight);
}
