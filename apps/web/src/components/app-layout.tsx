'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import UserMenu from './user-menu';

const TOUR_VIEWED_KEY = 'portfolio_tour_viewed';

const navigation = [
  { name: 'Wizard', href: '/wizard', id: 'nav-wizard' },
  { name: 'Blog', href: '/blog', id: 'nav-blog' },
  { name: 'Projetos', href: '/projects', id: 'nav-projects' },
  { name: 'Sobre', href: '/about', id: 'nav-about' },
  { name: 'Uses', href: '/uses', id: 'nav-uses' },
  { name: 'Entretenimento', href: '/entertainment', id: 'nav-entertainment' },
  { name: 'Contato', href: '/contact', id: 'nav-contact' },
  { name: 'Órbitas', href: '/orbits', id: 'nav-orbits' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const tourSteps: Step[] = [
  {
    target: '#nav-wizard',
    content: 'Comece aqui! O Wizard apresenta o portfolio de forma interativa e guiada.',
    disableBeacon: true,
    placement: 'bottom',
    title: 'Passo 1 de 8',
    locale: { next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-blog',
    content: 'Leia artigos sobre desenvolvimento web, arquitetura de software e tecnologias modernas.',
    placement: 'bottom',
    title: 'Passo 2 de 8',
    locale: { back: 'Anterior', next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-projects',
    content: 'Explore meus projetos e trabalhos desenvolvidos com tecnologias modernas.',
    placement: 'bottom',
    title: 'Passo 3 de 8',
    locale: { back: 'Anterior', next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-about',
    content: 'Conheça mais sobre mim, minhas habilidades e experiência profissional.',
    placement: 'bottom',
    title: 'Passo 4 de 8',
    locale: { back: 'Anterior', next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-uses',
    content: 'Descubra as ferramentas e tecnologias que uso no dia a dia para desenvolvimento.',
    placement: 'bottom',
    title: 'Passo 5 de 8',
    locale: { back: 'Anterior', next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-entertainment',
    content: 'Veja minhas recomendações de filmes, séries e podcasts sobre tecnologia e cultura.',
    placement: 'bottom',
    title: 'Passo 6 de 8',
    locale: { back: 'Anterior', next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-contact',
    content: 'Entre em contato para projetos, colaborações ou oportunidades.',
    placement: 'bottom',
    title: 'Passo 7 de 8',
    locale: { back: 'Anterior', next: 'Próximo', skip: 'Pular' },
  },
  {
    target: '#nav-orbits',
    content: 'Visualize mecânica orbital 3D com cálculos precisos baseados em dados da NASA.',
    placement: 'bottom',
    title: 'Passo 8 de 8',
    locale: { back: 'Anterior', last: 'Finalizar', skip: 'Pular' },
  },
];

export function AppLayout({ children, title }: AppLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isWizardPage = pathname === '/wizard';
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Não executar tour na home ou wizard
    if (isHomePage || isWizardPage) {
      return;
    }

    // Verificar se o tour já foi visto
    const hasViewedTour = localStorage.getItem(TOUR_VIEWED_KEY);

    if (hasViewedTour !== 'true') {
      // Delay para garantir que os elementos estão renderizados
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isHomePage, isWizardPage]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      // Marcar tour como visto
      localStorage.setItem(TOUR_VIEWED_KEY, 'true');
      setRunTour(false);
    }
  };

  // Na página inicial, não renderizar o layout padrão
  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full bg-black">
      {/* Tour Joyride */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress={false}
        showSkipButton
        scrollToFirstStep
        disableOverlayClose
        hideCloseButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#3b82f6',
            textColor: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            overlayColor: 'rgba(0, 0, 0, 0.6)',
            arrowColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
            padding: 20,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          tooltipContent: {
            padding: '8px 0',
            fontSize: 14,
            lineHeight: 1.6,
          },
          buttonNext: {
            background: 'linear-gradient(to right, #3b82f6, #9333ea)',
            borderRadius: 8,
            padding: '10px 20px',
            fontWeight: 600,
            border: 'none',
            color: '#ffffff',
          },
          buttonBack: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            marginRight: 10,
            borderRadius: 8,
            padding: '10px 20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          buttonSkip: {
            color: '#9ca3af',
            fontSize: 13,
          },
          buttonClose: {
            color: '#ffffff',
          },
        }}
        locale={{
          back: 'Anterior',
          close: 'Fechar',
          last: 'Finalizar',
          next: 'Próximo',
          open: 'Abrir',
          skip: 'Pular tour',
        }}
        floaterProps={{
          disableAnimation: false,
        }}
      />

      <Disclosure as="nav" className="bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
                    &lt;Portfolio /&gt;
                  </span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        id={item.id}
                        href={item.href as any}
                        aria-current={isActive ? 'page' : undefined}
                        className={classNames(
                          isActive
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-white/70 hover:bg-white/10 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium transition-colors'
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem(TOUR_VIEWED_KEY);
                  setRunTour(true);
                }}
                className="text-xs text-white/50 hover:text-white/80 transition-colors underline decoration-dotted"
              >
                Tour guiado
              </button>
              <UserMenu />
            </div>
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Abrir menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DisclosureButton
                  key={item.name}
                  id={`${item.id}-mobile`}
                  as={Link}
                  href={item.href as any}
                  aria-current={isActive ? 'page' : undefined}
                  className={classNames(
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium transition-colors'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              );
            })}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {title && (
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          </div>
        </header>
      )}

      <main className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
