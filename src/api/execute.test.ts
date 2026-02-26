import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';
import 'cadesplugin';
import { execute } from './execute';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';
import { __cadesAsyncToken__, __createCadesPluginObject__, _generateCadesFn } from '../helpers/_generateCadesFn';

vi.mock('../helpers/_extractMeaningfulErrorMessage', () => ({ _extractMeaningfulErrorMessage: vi.fn() }));
vi.mock('../helpers/_generateCadesFn', () => ({
  __cadesAsyncToken__: vi.fn(),
  __createCadesPluginObject__: vi.fn(),
  _generateCadesFn: vi.fn(),
}));

beforeEach(() => {
  (_extractMeaningfulErrorMessage as Mock).mockClear();
  (__cadesAsyncToken__ as Mock).mockClear();
  (__createCadesPluginObject__ as Mock).mockClear();
  (_generateCadesFn as Mock).mockClear();
});

describe('execute', () => {
  test('calls custom implementation with exposed API', async () => {
    const customCallback = vi.fn();

    await execute(customCallback);

    expect(customCallback).toHaveBeenCalledTimes(1);
    expect(customCallback).toHaveBeenCalledWith({
      cadesplugin: window.cadesplugin,
      _generateCadesFn,
      __cadesAsyncToken__,
      __createCadesPluginObject__,
      _extractMeaningfulErrorMessage,
    });
  });
});
