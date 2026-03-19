import { describe, test, expect, vi, beforeEach } from 'vitest';

import { createHash } from './createHash';

const executionSteps = [Symbol('step 0'), Symbol('step 1')];

const executionFlow = {
  [executionSteps[0]]: {
    propset_Algorithm: vi.fn(),
    propset_DataEncoding: vi.fn(),
    Hash: vi.fn(),
    Value: executionSteps[1],
  },
  [executionSteps[1]]: 'hash',
};

describe('createHash', () => {
  beforeEach(() => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);
    window.cadesplugin.CreateObjectAsync.mockImplementation((object) => {
      switch (object) {
        case 'CAdESCOM.HashedData':
          return executionSteps[0];
      }
    });
  });

  test('returns created hash for string message', async () => {
    const hash = await createHash('message');

    expect(hash).toEqual('hash');
  });

  test('returns created hash for ArrayBuffer message', async () => {
    const arrayBuffer = new ArrayBuffer(7);

    const hash = await createHash(arrayBuffer);

    expect(hash).toEqual('hash');
  });

  test('encodes string message to base64 using btoa', async () => {
    const btoaSpy = vi.spyOn(window, 'btoa');

    await createHash('message');

    expect(btoaSpy).toHaveBeenCalledTimes(1);

    btoaSpy.mockRestore();
  });

  test('encodes ArrayBuffer message to base64 using btoa', async () => {
    const btoaSpy = vi.spyOn(window, 'btoa');

    const arrayBuffer = new ArrayBuffer(7);

    await createHash(arrayBuffer);

    expect(btoaSpy).toHaveBeenCalledTimes(1);

    btoaSpy.mockRestore();
  });
});
