'use client';

import { motion } from 'framer-motion';
import { User, Code2, Briefcase, Mail, Github, Linkedin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sobre Mim
          </h1>
          <p className="text-white/70 text-lg">
            Desenvolvedor Full Stack apaixonado por tecnologia
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Mateus Salgueiro</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Desenvolvedor Full Stack com experiência em diversas tecnologias e frameworks modernos.
              Apaixonado por criar soluções eficientes e escaláveis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Habilidades</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'TypeScript',
                'React',
                'Next.js',
                'C#',
                'ASP.NET',
                'Node.js',
                'PostgreSQL',
                'Delphi',
                'Three.js',
              ].map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 text-center text-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Contato</h2>
            </div>
            <div className="space-y-3">
              <a
                href="https://github.com/psielta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <Github className="w-5 h-5 text-white/70 group-hover:text-white" />
                <span className="text-white/70 group-hover:text-white">github.com/psielta</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mateus-salgueiro-525717205/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <Linkedin className="w-5 h-5 text-white/70 group-hover:text-white" />
                <span className="text-white/70 group-hover:text-white">Mateus Salgueiro</span>
              </a>
              <a
                href="mailto:psielta@gmail.com"
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <Mail className="w-5 h-5 text-white/70 group-hover:text-white" />
                <span className="text-white/70 group-hover:text-white">psielta@gmail.com</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
