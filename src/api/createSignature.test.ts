import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';

import { rawCertificates, parsedCertificates } from '../mocks/certificates';
import { createSignature } from './createSignature';
import { _getCadesCert } from '../helpers/_getCadesCert';

const [rawCertificateMock] = rawCertificates;
const [parsedCertificateMock] = parsedCertificates;

vi.mock('../helpers/_getCadesCert', () => ({ _getCadesCert: vi.fn(() => rawCertificateMock) }));

beforeEach(() => {
  (_getCadesCert as Mock).mockClear();
});

const executionSteps = [Symbol('step 0'), Symbol('step 1'), Symbol('step 2'), Symbol('step 3'), Symbol('step 4')];

const executionFlow = {
  [executionSteps[0]]: {
    propset_Name: vi.fn(),
    propset_Value: vi.fn(),
  },
  [executionSteps[1]]: {
    propset_ContentEncoding: vi.fn(),
    propset_Content: vi.fn(),
    SignCades: vi.fn(() => executionSteps[4]),
  },
  [executionSteps[2]]: {
    propset_Certificate: vi.fn(),
    AuthenticatedAttributes2: executionSteps[3],
    propset_Options: vi.fn(),
  },
  [executionSteps[3]]: {
    Add: vi.fn(),
  },
  [executionSteps[4]]: 'signature',
};

describe('createSignature', () => {
  test('goes through whole execution flow to create signature', async () => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);
    window.cadesplugin.CreateObjectAsync.mockImplementation((object) => {
      switch (object) {
        case 'CADESCOM.CPAttribute':
          return executionSteps[0];
        case 'CAdESCOM.CadesSignedData':
          return executionSteps[1];
        case 'CAdESCOM.CPSigner':
          return executionSteps[2];
      }
    });

    const data = btoa('b285056dbf18d7392d7677369524dd14747459ed8143997e163b2986f92fd42c');
    const signature = await createSignature(parsedCertificateMock.thumbprint, data);

    expect(_getCadesCert).toHaveBeenCalledTimes(1);
    expect(signature).toEqual('signature');
  });
});
