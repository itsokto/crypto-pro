import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';

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

  test('uses Buffer to encrypt the message', async () => {
    const originalBufferFrom = Buffer.from;

    (Buffer.from as Mock) = vi.fn(() => ({
      toString: vi.fn(),
    }));

    await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(Buffer.from).toHaveBeenCalledTimes(1);

    Buffer.from = originalBufferFrom;
  });

  test('uses specified certificate', async () => {
    await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(_getCadesCert).toHaveBeenCalledWith(parsedCertificateMock.thumbprint);
  });

  test('returns signature', async () => {
    const signature = await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(signature).toEqual('signature');
  });

  test('converts ArrayBuffer message to base64', async () => {
    const arrayBuffer = new ArrayBuffer(7);

    const signature = await createAttachedSignature(parsedCertificateMock.thumbprint, arrayBuffer);

    expect(signature).toEqual('signature');
  });

  test('uses Buffer.from with Uint8Array for ArrayBuffer input', async () => {
    const originalBufferFrom = Buffer.from;
    const toStringMock = vi.fn();

    (Buffer.from as Mock) = vi.fn(() => ({
      toString: toStringMock,
    }));

    const arrayBuffer = new ArrayBuffer(7);

    await createAttachedSignature(parsedCertificateMock.thumbprint, arrayBuffer);

    expect(Buffer.from).toHaveBeenCalledTimes(1);
    expect(Buffer.from).toHaveBeenCalledWith(expect.any(Uint8Array));

    Buffer.from = originalBufferFrom;
  });
});
