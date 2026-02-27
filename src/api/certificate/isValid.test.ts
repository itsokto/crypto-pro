import { describe, test, expect, vi, beforeEach } from 'vitest';

import { isValid } from './isValid';

const executionSteps = [Symbol('step 0'), Symbol('step 1')];

const executionFlow = {
  [executionSteps[0]]: {
    Result: executionSteps[1],
  },
  [executionSteps[1]]: true,
};

describe('isValid', () => {
  test('returns validity state of certificate', async () => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);

    const valid = await isValid.call({
      _cadesCertificate: {
        IsValid: vi.fn(() => executionSteps[0]),
      },
    });

    expect(valid).toEqual(true);
  });
});
