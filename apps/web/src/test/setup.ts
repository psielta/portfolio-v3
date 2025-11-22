import '@testing-library/jest-dom';

// Mock do fetch global
global.fetch = vi.fn();

// Mock do Next.js Router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));