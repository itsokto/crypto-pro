import { beforeEach, vi, afterEach } from 'vitest';
import { cadespluginMock } from './src/mocks/cadesplugin';
import { consoleMock } from './src/mocks/console-mock';

beforeEach(() => {
  vi.stubGlobal('cadesplugin', cadespluginMock());
  vi.stubGlobal('console', consoleMock());
});

afterEach(() => {
  vi.unstubAllGlobals()
})
