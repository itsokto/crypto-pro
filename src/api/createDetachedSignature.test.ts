import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';

import { rawCertificates, parsedCertificates } from '../mocks/certificates';
import { createDetachedSignature } from './createDetachedSignature';
import { _getCadesCert } from '../helpers/_getCadesCert';

const [rawCertificateMock] = rawCertificates;
const [parsedCertificateMock] = parsedCertificates;

vi.mock('../helpers/_getCadesCert', () => ({ _getCadesCert: vi.fn(() => rawCertificateMock) }));

beforeEach(() => {
  (_getCadesCert as Mock).mockClear();
});

const executionSteps = [
  Symbol('step 0'),
  Symbol('step 1'),
  Symbol('step 2'),
  Symbol('step 3'),
  Symbol('step 4'),
  Symbol('step 5'),
];

const executionFlow = {
  [executionSteps[0]]: {
    propset_Name: vi.fn(),
    propset_Value: vi.fn(),
  },
  [executionSteps[1]]: {
    propset_ContentEncoding: vi.fn(),
    propset_Content: vi.fn(),
    SignHash: vi.fn(() => executionSteps[4]),
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
  [executionSteps[5]]: {
    propset_Algorithm: vi.fn(),
    SetHashValue: vi.fn(),
  },
};

describe('createDetachedSignature', () => {
  beforeEach(() => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);
    window.cadesplugin.CreateObjectAsync.mockImplementation((object) => {
      switch (object) {
        case 'CADESCOM.CPAttribute':
          return executionSteps[0];
        case 'CAdESCOM.CadesSignedData':
          return executionSteps[1];
        case 'CAdESCOM.CPSigner':
          return executionSteps[2];
        case 'CAdESCOM.HashedData':
          return executionSteps[5];
      }
    });
  })

  test('uses specified certificate', async () => {
    await createDetachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(_getCadesCert).toHaveBeenCalledWith(parsedCertificateMock.thumbprint);
  });

  test('returns signature', async () => {
    const signature = await createDetachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(signature).toEqual('signature');
  });
});
