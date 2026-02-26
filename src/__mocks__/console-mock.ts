import { vi } from 'vitest';

// suppress logging errors to stdout while running tests
window.console.error = vi.fn();
window.console.warn = vi.fn();
