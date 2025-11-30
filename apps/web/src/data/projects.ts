export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
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
  {
    id: 'linve',
    name: 'Linve',
    description: 'Sistema de gestão multi-tenant para lanchonetes, pizzarias e estabelecimentos de delivery, desenvolvido com Spring Boot (backend) e Angular (frontend).',
    url: 'https://github.com/psielta/linve',
    stars: 0,
    forks: 0,
    language: 'Java',
    languageColor: LANGUAGE_COLORS['Java'],
    technologies: ['Java', 'Spring Boot', 'Spring Security', 'Angular', 'TypeScript', 'PrimeNG', 'SQLite', 'JWT'],
    createdAt: '2025-11-30T00:00:00Z',
    updatedAt: '2025-11-30T00:00:00Z',
    highlight: true,
    category: 'Full Stack',
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
