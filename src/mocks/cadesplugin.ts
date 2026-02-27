import { vi } from 'vitest';

let executionFlow = null;

export const cadespluginMock = vi.fn(() => ({
  set_log_level: vi.fn(),
  getLastError: vi.fn(),
  CreateObjectAsync: vi.fn(),
  __defineExecutionFlow: (newExecutionFlow): void => {
    executionFlow = newExecutionFlow;
  },
  async_spawn: vi.fn((generatorFn) => {
    const generatorIterable = generatorFn();
    let iterable = generatorIterable.next();

    while (!iterable.done) {
      iterable = generatorIterable.next(executionFlow[iterable.value]);
    }

    return iterable.value;
  }),
  LOG_LEVEL_DEBUG: 4,
}));

