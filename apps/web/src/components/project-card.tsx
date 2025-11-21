'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Star, GitFork, Calendar, Code2 } from 'lucide-react';
import type { Project } from '@/data/projects';
import { formatDate } from '@/data/projects';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full"
    >
      {/* Card principal */}
      <div className="h-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-blue-500/40 hover:bg-white/8 transition-all overflow-hidden shadow-lg hover:shadow-blue-500/10">
        {/* Badge de destaque */}
        {project.highlight && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
              Destaque
            </span>
          </div>
        )}

        {/* Header do card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 relative">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <p className="text-white/70 text-sm line-clamp-2 mb-3 cursor-help">
                {project.description}
              </p>

              {/* Tooltip com descrição completa */}
              {showTooltip && project.description.length > 80 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 left-0 right-0 top-full mt-2 p-3 bg-black/95 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl"
                >
                  <p className="text-white/90 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-black/95 border-l border-t border-white/20 rotate-45" />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Tecnologias */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-white/5 text-white/50 text-xs rounded border border-white/10">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Informações do repositório */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-4">
          {/* Linguagem */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.languageColor }}
            />
            <span>{project.language}</span>
          </div>

          {/* Stars */}
          {project.stars > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{project.stars}</span>
            </div>
          )}

          {/* Forks */}
          {project.forks > 0 && (
            <div className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              <span>{project.forks}</span>
            </div>
          )}

          {/* Data de atualização */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Atualizado em {formatDate(project.updatedAt)}</span>
          </div>
        </div>

        {/* Categoria */}
        {project.category && (
          <div className="mb-4">
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">
              {project.category}
            </span>
          </div>
        )}

        {/* Botão de ação */}
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all group/btn"
        >
          <span>Ver no GitHub</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>

      </div>
    </motion.div>
  );
}
