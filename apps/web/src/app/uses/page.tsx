'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Monitor,
  Palette,
  Zap,
  Server,
  Terminal,
  Package,
  Cpu,
  Layers,
  Wrench
} from 'lucide-react';
import { ToolCard } from '@/components/ui/tool-card';

const tools = {
  'Development Tools': {
    icon: <Code2 className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    items: [
      {
        title: 'VSCode',
        description: 'Meus projetos Frontend basicamente uso VSCode. Já tive muita vontade de usar WebStorm da JetBrains, mas devido ser paga não quis levar isso para frente. O VSCode me atende muito bem e é o que todo mundo usa.',
        icon: <Terminal className="w-6 h-6" />,
        href: 'https://code.visualstudio.com/',
        recommended: true,
      },
      {
        title: 'Visual Studio 2022',
        description: 'Para projetos Backend e ASP.NET MVC utilizo o Visual Studio 2022. É uma IDE muito capaz com excelente gerenciamento visual de pacotes NuGet, facilitando a procura de novos componentes de modo integrado.',
        icon: <Monitor className="w-6 h-6" />,
        href: 'https://visualstudio.microsoft.com/',
      },
      {
        title: 'Delphi 10.1 Berlin',
        description: 'IDE para desenvolvimento do sistema ERP na linguagem Object Pascal. Muito consolidada e funcional, mas às vezes deixa a desejar em personalizações e extensões.',
        icon: <Cpu className="w-6 h-6" />,
      },
    ],
  },
  'Design': {
    icon: <Palette className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600',
    items: [
      {
        title: 'Figma',
        description: 'Ferramenta essencial para modelar previamente aquilo que se deseja construir. Se engenheiros civis têm plantas para construir casas e prédios, por que desenvolvedores não podem ter algo do tipo também?',
        icon: <Layers className="w-6 h-6" />,
        href: 'https://www.figma.com/',
        recommended: true,
      },
      {
        title: 'Adobe Firefly',
        description: 'IA generativa da Adobe para criação de imagens, efeitos e designs. Excelente para prototipagem rápida e geração de assets visuais únicos.',
        icon: <Palette className="w-6 h-6" />,
        href: 'https://www.adobe.com/products/firefly.html',
      },
    ],
  },
  'Produtividade': {
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-600',
    items: [
      {
        title: 'Notion',
        description: 'Substituí o Evernote pelo Notion. Basicamente faz o mesmo porém integrado com IA de modo mais sólido e fácil de usar. Perfeito para organizar conhecimento e projetos.',
        icon: <Package className="w-6 h-6" />,
        href: 'https://www.notion.so/',
        recommended: true,
      },
      {
        title: 'GitHub Copilot',
        description: 'Agente de IA que ajuda a programar sugerindo códigos usando o contexto do projeto. Mais simples que o Cursor, porém muito bem consolidado e eficiente.',
        icon: <Code2 className="w-6 h-6" />,
        href: 'https://github.com/features/copilot',
      },
      {
        title: 'Cursor',
        description: 'IDE completa com IA integrada utilizando Claude. Mais funcionalidades que o GitHub Copilot, com opções de múltiplos modelos de IA incluindo GPT-4 e Claude.',
        icon: <Terminal className="w-6 h-6" />,
        href: 'https://cursor.sh/',
        recommended: true,
      },
    ],
  },
  'Deploy & DevOps': {
    icon: <Server className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    items: [
      {
        title: 'nginx',
        description: 'Em VPS Linux uso nginx para publicar sites e aplicações. Muito fácil de configurar, embora alguns casos específicos possam ser complexos. Sempre guardo exemplos no Notion.',
        icon: <Server className="w-6 h-6" />,
        href: 'https://nginx.org/',
        recommended: true,
      },
      {
        title: 'IIS',
        description: 'Excelente para aplicativos Microsoft. Para ASP.NET, basta copiar os assemblies e configurar no IIS. Para outras tecnologias pode ser complexo com web.config.',
        icon: <Monitor className="w-6 h-6" />,
        href: 'https://www.iis.net/',
      },
      {
        title: 'PM2',
        description: 'Para aplicações Node.js/Next.js, o PM2 é uma das melhores opções. Mantém a aplicação rodando em background e pode ser usado com nginx para proxy reverso.',
        icon: <Terminal className="w-6 h-6" />,
        href: 'https://pm2.keymetrics.io/',
        recommended: true,
      },
      {
        title: 'Docker',
        description: 'Containerização de aplicações para deploy consistente. Essencial para microserviços e ambientes de desenvolvimento padronizados.',
        icon: <Package className="w-6 h-6" />,
        href: 'https://www.docker.com/',
      },
      {
        title: 'Vercel',
        description: 'Plataforma de deploy para aplicações Next.js e frontend. Deploy automático com git push, preview branches e otimizações automáticas.',
        icon: <Zap className="w-6 h-6" />,
        href: 'https://vercel.com/',
        recommended: true,
      },
    ],
  },
};

export default function UsesPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ferramentas & Tecnologias
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Software que utilizo, tecnologias que domino e ferramentas que recomendo
            para desenvolvimento moderno e produtividade
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Meu Stack</h2>
          </div>
          <p className="text-white/80 leading-relaxed">
            Nesta seção apresento as tecnologias que utilizo em meu trabalho, estudos e projetos pessoais.
            Estas ferramentas foram cuidadosamente selecionadas ao longo dos anos e representam meu
            workflow atual para desenvolvimento full-stack, desde a concepção até o deploy em produção.
          </p>
        </motion.div>

        {/* Tools Sections */}
        <div className="space-y-12">
          {Object.entries(tools).map(([category, { icon, color, items }], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1 }}
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-lg bg-gradient-to-r ${color}`}
                >
                  {icon}
                </motion.div>
                <h2 className="text-2xl font-bold text-white">{category}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((tool, index) => (
                  <ToolCard
                    key={tool.title}
                    {...tool}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Menções Honrosas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Linguagens & Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {['TypeScript', 'C#', 'Go', 'Delphi', 'React', 'Next.js', 'ASP.NET', 'Angular', 'Three.js'].map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm border border-purple-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Bancos de Dados & Infra</h3>
              <div className="flex flex-wrap gap-2">
                {['PostgreSQL', 'MySQL', 'Redis', 'MongoDB', 'SQLite', 'GitHub Actions', 'CloudFlare'].map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm border border-cyan-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center">
              💡 Sempre em busca de novas ferramentas e tecnologias que possam melhorar meu workflow e produtividade
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}