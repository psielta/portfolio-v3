'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FolderGit2,
  Globe,
  Home,
  Mail,
  Orbit,
  Rocket,
  Sparkles,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const WIZARD_VIEWED_KEY = 'portfolio_wizard_viewed';

const wizardSteps = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Portfolio',
    icon: Check,
    gradient: 'from-blue-500 to-purple-600',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Mateus Salgueiro
          </h2>
          <p className="text-white/80 text-lg">
            Portfolio pessoal desenvolvido com tecnologias modernas
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Next.js 16
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm border border-pink-500/30">
              Three.js
            </span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30">
              tRPC
            </span>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'home',
    title: 'Sistema Solar 3D',
    icon: Home,
    gradient: 'from-yellow-500 to-orange-600',
    route: '/',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
            <Home className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center">Página Inicial</h3>
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Visualização 3D Interativa</p>
                <p className="text-sm text-white/70">Sistema solar animado em tempo real com Three.js</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Performance Otimizada</p>
                <p className="text-sm text-white/70">WebGL nativo com aceleração GPU e 60 FPS</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Globe className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Controles Interativos</p>
                <p className="text-sm text-white/70">Zoom, rotação, velocidade de animação e vetores físicos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'orbits',
    title: 'Mecânica Orbital',
    icon: Orbit,
    gradient: 'from-cyan-500 to-blue-600',
    route: '/orbits',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ delay: 0.2, duration: 2, ease: 'linear' }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
            <Orbit className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center">Visualização de Órbitas</h3>
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Code2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Elementos Orbitais Customizáveis</p>
                <p className="text-sm text-white/70">Ajuste periélio, excentricidade, inclinação, RAAN e mais</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Cálculos Precisos</p>
                <p className="text-sm text-white/70">Propagação Kepleriana baseada em dados da NASA JPL</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Globe className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Visualização Educativa</p>
                <p className="text-sm text-white/70">Veja como parâmetros orbitais afetam trajetórias reais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'blog',
    title: 'Blog Técnico',
    icon: BookOpen,
    gradient: 'from-indigo-500 to-purple-600',
    route: '/blog',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center">Blog de Desenvolvimento</h3>
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Artigos com MDX</p>
                <p className="text-sm text-white/70">Conteúdo rico com código, componentes interativos e demos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Code2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Compartilhamento de Conhecimento</p>
                <p className="text-sm text-white/70">Tutoriais sobre desenvolvimento web, arquitetura e tecnologias modernas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <Zap className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">SEO Otimizado</p>
                <p className="text-sm text-white/70">Metadados estruturados, Open Graph e performance otimizada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Recursos do Portfolio',
    icon: FolderGit2,
    gradient: 'from-purple-500 to-pink-600',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            <FolderGit2 className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center">Outras Seções</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/blog">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <p className="font-semibold text-white">Blog</p>
                </div>
                <p className="text-sm text-white/70">
                  Artigos sobre desenvolvimento e tecnologia
                </p>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </Link>
            <Link href="/projects">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <FolderGit2 className="w-5 h-5 text-purple-400" />
                  <p className="font-semibold text-white">Projetos</p>
                </div>
                <p className="text-sm text-white/70">
                  Explore meus projetos e trabalhos desenvolvidos
                </p>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </Link>
            <Link href="/about">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <p className="font-semibold text-white">Sobre</p>
                </div>
                <p className="text-sm text-white/70">
                  Conheça mais sobre mim e minhas habilidades
                </p>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </Link>
            <Link href="/contact">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-pink-400" />
                  <p className="font-semibold text-white">Contato</p>
                </div>
                <p className="text-sm text-white/70">
                  Entre em contato para projetos e oportunidades
                </p>
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tech',
    title: 'Stack Tecnológica',
    icon: Code2,
    gradient: 'from-green-500 to-emerald-600',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
            <Code2 className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white text-center">Tecnologias Utilizadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Next.js 16', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', textColor: 'text-blue-400' },
              { name: 'React 19', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-400' },
              { name: 'TypeScript', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', textColor: 'text-blue-400' },
              { name: 'Three.js', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', textColor: 'text-green-400' },
              { name: 'tRPC', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', textColor: 'text-purple-400' },
              { name: 'Prisma', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/30', textColor: 'text-indigo-400' },
              { name: 'TailwindCSS', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-400' },
              { name: 'Framer Motion', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/30', textColor: 'text-pink-400' },
              { name: 'Turborepo', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', textColor: 'text-red-400' },
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-3 ${tech.bgColor} rounded-lg border ${tech.borderColor} text-center`}
              >
                <p className={`text-sm font-semibold ${tech.textColor}`}>{tech.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-2">Arquitetura Monorepo</h4>
            <p className="text-sm text-white/70">
              Projeto organizado com Turborepo, separando aplicação web, API e banco de dados
              em pacotes independentes para máxima escalabilidade.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'finish',
    title: 'Pronto para Explorar!',
    icon: CheckCircle2,
    gradient: 'from-pink-500 to-rose-600',
    isFinish: true,
  },
];

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const step = wizardSteps[currentStep];
  const Icon = step.icon;

  useEffect(() => {
    // Verificar se tem parâmetro force=true para forçar exibição
    const params = new URLSearchParams(window.location.search);
    const forceView = params.get('force') === 'true';
    const fromHome = params.get('from') === 'home';

    if (forceView) {
      // Forçar visualização do wizard
      setIsLoading(false);
      return;
    }

    // Apenas verificar localStorage se veio da home
    if (fromHome) {
      const hasViewed = localStorage.getItem(WIZARD_VIEWED_KEY);

      if (hasViewed === 'true') {
        // Se já viu e veio da home, redirecionar para /projects
        router.push('/projects');
        return;
      }
    }

    // Se não veio da home ou se nunca viu, mostrar o wizard
    setIsLoading(false);
  }, [router]);

  const markAsViewed = () => {
    localStorage.setItem(WIZARD_VIEWED_KEY, 'true');
  };

  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Mostrar loading enquanto verifica
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Rocket className="w-12 h-12 text-blue-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background de estrelas animado */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1px 1px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 90%, white, transparent),
              radial-gradient(1px 1px at 15% 80%, white, transparent)
            `,
            backgroundSize: '200% 200%',
            opacity: 0.3,
          }}
        />
      </div>

      {/* Conteúdo do wizard */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header com progresso */}
        <div className="w-full px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer">
                  &lt;Portfolio /&gt;
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {wizardSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep
                          ? 'w-8 bg-gradient-to-r ' + step.gradient
                          : index < currentStep
                          ? 'w-2 bg-white/50'
                          : 'w-2 bg-white/20'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>
                <Link href="/projects" onClick={markAsViewed}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10 text-xs"
                  >
                    Pular tour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
              >
                {/* Header do step */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${step.gradient}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      {step.title}
                    </h2>
                  </div>
                  {step.route && (
                    <div className="flex justify-center">
                      <span className="text-sm text-white/50 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {step.route}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo do step */}
                <div className="mb-8">
                  {step.isFinish ? (
                    <div className="space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="flex justify-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                      </motion.div>
                      <div className="space-y-4 text-center">
                        <h3 className="text-2xl font-bold text-white">Você está pronto!</h3>
                        <p className="text-white/80">
                          Explore o portfolio e descubra todos os recursos disponíveis.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                          <Link href="/projects" onClick={markAsViewed}>
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6">
                              <FolderGit2 className="w-4 h-4 mr-2" />
                              Ver Projetos
                            </Button>
                          </Link>
                          <Link href="/orbits" onClick={markAsViewed}>
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6">
                              <Orbit className="w-4 h-4 mr-2" />
                              Mecânica Orbital
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    step.content
                  )}
                </div>

                {/* Navegação */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="text-sm text-white/50">
                    {currentStep + 1} / {wizardSteps.length}
                  </div>

                  {currentStep < wizardSteps.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      className={`bg-gradient-to-r ${step.gradient} text-white hover:opacity-90`}
                    >
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Link href="/projects" onClick={markAsViewed}>
                      <Button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:opacity-90">
                        Começar
                        <Rocket className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full px-4 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/50 text-sm">
              Desenvolvido por <span className="text-white/70 font-semibold">Mateus Salgueiro</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
