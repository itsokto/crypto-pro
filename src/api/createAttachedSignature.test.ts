import { describe, test, expect, beforeEach, vi, type Mock } from 'vitest';

import { rawCertificates, parsedCertificates } from '../mocks/certificates';
import { createAttachedSignature } from './createAttachedSignature';
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

describe('createAttachedSignature', () => {
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
      }
    });
  });

  test('uses specified certificate', async () => {
    await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(_getCadesCert).toHaveBeenCalledWith(parsedCertificateMock.thumbprint);
  });

  test('returns signature for string message', async () => {
    const signature = await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(signature).toEqual('signature');
  });

  test('returns signature for ArrayBuffer message', async () => {
    const arrayBuffer = new ArrayBuffer(7);

    const signature = await createAttachedSignature(parsedCertificateMock.thumbprint, arrayBuffer);

    expect(signature).toEqual('signature');
  });

  test('encodes string message to base64 using btoa', async () => {
    const btoaSpy = vi.spyOn(window, 'btoa');

    await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(btoaSpy).toHaveBeenCalledTimes(1);

    btoaSpy.mockRestore();
  });

  test('encodes ArrayBuffer message to base64 using btoa', async () => {
    const btoaSpy = vi.spyOn(window, 'btoa');

    const arrayBuffer = new ArrayBuffer(7);

    await createAttachedSignature(parsedCertificateMock.thumbprint, arrayBuffer);

    expect(btoaSpy).toHaveBeenCalledTimes(1);

    btoaSpy.mockRestore();
  });
});
