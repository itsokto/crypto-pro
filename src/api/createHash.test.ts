import { describe, test, expect, vi, Mock, beforeEach } from 'vitest';

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

  test('uses Buffer to encrypt the message', async () => {
    const originalBufferFrom = Buffer.from;

    (Buffer.from as Mock) = vi.fn(() => ({
      toString: vi.fn(),
    }));

    await createHash('message');

    expect(Buffer.from).toHaveBeenCalledTimes(1);

    Buffer.from = originalBufferFrom;
  });

  test('returns created hash', async () => {
    const hash = await createHash('message');

    expect(hash).toEqual('hash');
  });

  test('returns created hash with specified encoding', async () => {
    const hash = await createHash('message', { encoding: 'binary' });

    expect(hash).toEqual('hash');
  });

  test('converts ArrayBuffer message to base64', async () => {
    const arrayBuffer = new ArrayBuffer(7);

    const hash = await createHash(arrayBuffer);

    expect(hash).toEqual('hash');
  });

  test('uses Buffer.from with Uint8Array for ArrayBuffer input', async () => {
    const originalBufferFrom = Buffer.from;
    const toStringMock = vi.fn();

    (Buffer.from as Mock) = vi.fn(() => ({
      toString: toStringMock,
    }));

    const arrayBuffer = new ArrayBuffer(7);

    await createHash(arrayBuffer);

    expect(Buffer.from).toHaveBeenCalledTimes(1);
    expect(Buffer.from).toHaveBeenCalledWith(expect.any(Uint8Array));

    Buffer.from = originalBufferFrom;
  });
});
