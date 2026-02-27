import { vi } from 'vitest';

// suppress logging errors to stdout while running tests
export const consoleMock = vi.fn(() => ({
  error: vi.fn(),
  warn: vi.fn(),
}));
