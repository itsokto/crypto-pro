import { vi } from 'vitest';

let executionFlow = null;

Object.defineProperty(window, 'cadesplugin', {
  writable: true,
  value: {
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
  },
});
