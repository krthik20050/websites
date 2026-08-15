import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useParams: () => ({}),
  useSearchParams: () => ({
    get: () => null,
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({
    data: null,
    isPending: false,
  }),
}));

vi.mock('next/image', () => ({
  default: function ImageComponent({ src, alt, ...props }: any) {
    return Object.assign(document.createElement('img'), { src, alt, ...props });
  },
}));

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn(),
});