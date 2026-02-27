import { describe, test, expect, vi } from 'vitest';
import { getExtendedKeyUsage } from './getExtendedKeyUsage';

const oidsMock = ['1.3.6.1.4.1.311.80.1'];

const executionSteps = [Symbol('step 0'), Symbol('step 1'), Symbol('step 2'), Symbol('step 3'), Symbol('step 4')];

const executionFlow = {
  [executionSteps[0]]: {
    EKUs: executionSteps[1],
  },
  [executionSteps[1]]: {
    Count: executionSteps[2],
    Item: vi.fn(() => executionSteps[3]),
  },
  [executionSteps[2]]: 1,
  [executionSteps[3]]: {
    OID: executionSteps[4],
  },
  [executionSteps[4]]: oidsMock[0],
};

describe('getExtendedKeyUsage', () => {
  test('returns info about oids', async () => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);

    const oids = await getExtendedKeyUsage.call({
      _cadesCertificate: {
        ExtendedKeyUsage: vi.fn(() => executionSteps[0]),
      },
    });

    expect(oids).toStrictEqual(oidsMock);
  });
});
