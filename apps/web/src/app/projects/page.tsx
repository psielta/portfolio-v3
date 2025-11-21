'use client';

import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projects } from '@/data/projects';
import { motion } from 'framer-motion';
import { Code2, ExternalLink, Filter, Github, Search } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrar projetos
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm === '' ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory = !selectedCategory || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Meus Projetos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Explore meus trabalhos e projetos desenvolvidos com diferentes tecnologias e stacks
          </motion.p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 space-y-4"
        >
          {/* Barra de busca */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500/50"
            />
          </div>

          {/* Filtro de categorias */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={`${
                  selectedCategory === null
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Filter className="w-3 h-3 mr-1" />
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Grid de projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <Code2 className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/50">Nenhum projeto encontrado</p>
            </motion.div>
          )}
        </div>

        {/* Seção de adicionar mais projetos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Mais projetos em breve</h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Estou sempre trabalhando em novos projetos. Acompanhe meu GitHub para ver as últimas atualizações.
          </p>
          <a
            href="https://github.com/psielta?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
          >
            <Github className="w-5 h-5" />
            Ver todos os repositórios
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
