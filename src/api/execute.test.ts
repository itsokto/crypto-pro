import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';
import 'cadesplugin';
import { execute } from './execute';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';

vi.mock('../helpers/_extractMeaningfulErrorMessage', () => ({ _extractMeaningfulErrorMessage: vi.fn() }));

beforeEach(() => {
  (_extractMeaningfulErrorMessage as Mock).mockClear();
});

describe('execute', () => {
  test('calls custom implementation with exposed API', async () => {
    const customCallback = vi.fn();

    await execute(customCallback);

    expect(customCallback).toHaveBeenCalledTimes(1);
    expect(customCallback).toHaveBeenCalledWith({
      cadesplugin: window.cadesplugin,
      _extractMeaningfulErrorMessage,
    });
  });
});
