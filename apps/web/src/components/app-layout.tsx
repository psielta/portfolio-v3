'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './mode-toggle';

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Órbitas', href: '/orbits' },
  { name: 'Tarefas', href: '/todos' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-primary border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-primary-foreground font-mono">
                    {/* &lt;Portfolio /&gt; */}
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
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={classNames(
                          isActive
                            ? 'bg-primary-foreground/10 text-primary-foreground font-semibold'
                            : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground',
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
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <ModeToggle />
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-primary-foreground/10 p-2 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary focus:outline-hidden">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Abrir menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden border-t border-primary-foreground/10">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={classNames(
                    isActive
                      ? 'bg-primary-foreground/10 text-primary-foreground font-semibold'
                      : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground',
                    'block rounded-md px-3 py-2 text-base font-medium transition-colors'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              );
            })}
          </div>
          <div className="border-t border-primary-foreground/10 pt-4 pb-3">
            <div className="flex items-center px-5">
              <ModeToggle />
              <span className="ml-3 text-sm text-primary-foreground/70">Alternar tema</span>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      {title && (
        <header className="bg-card border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          </div>
        </header>
      )}

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
