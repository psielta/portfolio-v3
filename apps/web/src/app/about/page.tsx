'use client';

import { Timeline } from '@/components/ui/timeline';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Code2,
  Database,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Monitor,
  Server,
  Sparkles,
  User
} from 'lucide-react';
import Link from 'next/link';

const experiences = [
  {
    date: '2023 - Presente',
    title: 'Desenvolvedor Full Stack',
    company: 'Global Software e Informação',
    description: 'Desenvolvimento e manutenção de sistemas ERP fiscal (Delphi + ACBr), sistema de licitações públicas (ASP.NET MVC 5) e módulo de banco de preços para Dispensas e Pregões Eletrônicos.',
    current: true,
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    date: '2020 - 2021',
    title: 'Suporte Técnico ERP',
    company: 'Telluria Tecnologia SA',
    description: 'Suporte técnico especializado em sistemas ERP, resolução de problemas e treinamento de usuários.',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    date: '2019 - 2020',
    title: 'Eletricista de Automóveis',
    company: 'Auto Elétrica Colombaroli',
    description: 'Diagnóstico e reparo de sistemas elétricos automotivos, instalação de acessórios e manutenção preventiva.',
    icon: <Globe className="w-6 h-6" />,
  },
];

const skills = {
  'Frontend': [
    'TypeScript', 'React', 'Next.js', 'Angular', 'Ionic', 'Expo', 'Three.js', 'Framer Motion', 'TailwindCSS'
  ],
  'Backend': [
    'C#', 'ASP.NET Core', '.NET 8', '.NET Framework', 'Go', 'Node.js', 'tRPC', 'Prisma'
  ],
  'Desktop': [
    'Delphi 10.1', 'Windows Forms', 'FastReport', 'ACBr'
  ],
  'Banco de Dados': [
    'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'MongoDB'
  ],
  'DevOps & Deploy': [
    'Docker', 'nginx', 'IIS', 'pm2', 'GitHub Actions', 'Vercel'
  ],
};

const skillColors: Record<string, string> = {
  'Frontend': 'from-blue-500 to-cyan-600',
  'Backend': 'from-purple-500 to-indigo-600',
  'Desktop': 'from-green-500 to-emerald-600',
  'Banco de Dados': 'from-orange-500 to-red-600',
  'DevOps & Deploy': 'from-pink-500 to-rose-600',
};

const skillIcons: Record<string, React.ReactNode> = {
  'Frontend': <Monitor className="w-5 h-5" />,
  'Backend': <Server className="w-5 h-5" />,
  'Desktop': <Monitor className="w-5 h-5" />,
  'Banco de Dados': <Database className="w-5 h-5" />,
  'DevOps & Deploy': <Globe className="w-5 h-5" />,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sobre Mim
          </h1>
          <p className="text-white/70 text-lg">
            Desenvolvedor Full Stack apaixonado por criar soluções inovadoras
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                transition={{
                  scale: { delay: 0.3, type: 'spring' },
                  rotate: { duration: 2, repeat: Infinity, repeatDelay: 5 }
                }}
                className="relative inline-block mb-6"
              >
                <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <User className="w-20 h-20 text-white/80" />
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">Mateus Salgueiro</h2>
              <p className="text-purple-400 font-medium mb-4">Desenvolvedor Full Stack</p>

              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                <span>São Sebastião do Paraíso - MG</span>
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 space-y-3">
              <h3 className="text-lg font-bold text-white mb-4">Conecte-se</h3>

              <Link
                href="https://github.com/psielta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Github className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white group-hover:text-purple-400 transition-colors">GitHub</p>
                  <p className="text-white/50 text-sm">@psielta</p>
                </div>
              </Link>

              <Link
                href="https://www.linkedin.com/in/mateus-salgueiro-525717205/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white group-hover:text-blue-400 transition-colors">LinkedIn</p>
                  <p className="text-white/50 text-sm">Mateus Salgueiro</p>
                </div>
              </Link>

              <Link
                href="mailto:psielta@gmail.com"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white group-hover:text-pink-400 transition-colors">Email</p>
                  <p className="text-white/50 text-sm">psielta@gmail.com</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Sobre</h2>
              </div>

              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  Trabalho em uma software house enxuta, onde somos apenas três desenvolvedores
                  e não há divisão formal de funções. Participar de todo o ciclo — análise, UI,
                  backend, banco, deploy e suporte — é rotina. Dessa forma, ser full-stack é
                  uma necessidade.
                </p>
                <p>
                  Programo diariamente em <span className="text-blue-400 font-semibold">Delphi 10.1</span>,
                  <span className="text-purple-400 font-semibold"> C#</span>,
                  <span className="text-yellow-400 font-semibold"> JavaScript</span> e
                  <span className="text-cyan-400 font-semibold"> TypeScript</span>.
                  No backend utilizo .NET 8/ASP.NET Core, .NET Framework 4.8 (MVC 5) e Go;
                  no frontend, React, Next.js, Angular, Ionic e Expo; no desktop, Delphi e Windows Forms.
                </p>
                <p>
                  Tenho experiência sólida com bancos de dados relacionais (em especial PostgreSQL),
                  integrações REST e manutenção de sistemas legados. Hoje mantenho um ERP fiscal
                  desktop (Delphi + ACBr + FastReport) e participo do desenvolvimento de um sistema
                  de licitações públicas em ASP.NET MVC 5.
                </p>
                <p>
                  Em meu tempo livre, desenvolvo projetos pessoais. Atualmente possuo um cliente
                  que usa um sistema de pedidos e gerenciamento de comissões para vendedores que
                  desenvolvi. Acredito que projetos pessoais são a maior fonte de conhecimento,
                  permitindo trazer inovações como Next.js e Go para o ambiente de trabalho.
                </p>
              </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Habilidades Técnicas</h2>
              </div>

              <div className="space-y-6">
                {Object.entries(skills).map(([category, items], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + categoryIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${skillColors[category]}`}>
                        {skillIcons[category]}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill, index) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + categoryIndex * 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium
                            bg-gradient-to-r ${skillColors[category]} bg-opacity-10
                            border border-white/20 text-white/90
                            hover:border-white/40 transition-all cursor-default
                          `}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Experience Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Experiência Profissional</h2>
              </div>

              <Timeline items={experiences} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
