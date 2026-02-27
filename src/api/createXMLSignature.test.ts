import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';

import { rawCertificates, parsedCertificates } from '../mocks/certificates';
import { createXMLSignature } from './createXMLSignature';
import { _getCadesCert } from '../helpers/_getCadesCert';

const [rawCertificateMock] = rawCertificates;
const [parsedCertificateMock] = parsedCertificates;

vi.mock('../helpers/_getCadesCert', () => ({ _getCadesCert: vi.fn(() => rawCertificateMock) }));

beforeEach(() => {
  (_getCadesCert as Mock).mockClear();
});

const executionSteps = [Symbol('step 0'), Symbol('step 1'), Symbol('step 2')];

const executionFlow = {
  [executionSteps[0]]: {
    propset_Certificate: vi.fn(),
    propset_CheckCertificate: vi.fn(),
  },
  [executionSteps[1]]: {
    propset_Content: vi.fn(),
    propset_SignatureType: vi.fn(),
    propset_SignatureMethod: vi.fn(),
    propset_DigestMethod: vi.fn(),
    Sign: vi.fn(() => executionSteps[2]),
  },
  [executionSteps[2]]: 'signature',
};

describe('createXMLSignature', () => {
  beforeEach(() => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);
    window.cadesplugin.CreateObjectAsync.mockImplementation((object) => {
      switch (object) {
        case 'CAdESCOM.CPSigner':
          return executionSteps[0];
        case 'CAdESCOM.SignedXML':
          return executionSteps[1];
      }
    });
  });

  test('uses specified certificate', async () => {
    await createXMLSignature(parsedCertificateMock.thumbprint, 'message');

    expect(_getCadesCert).toHaveBeenCalledWith(parsedCertificateMock.thumbprint);
  });

  test('returns signature', async () => {
    const signature = await createXMLSignature(
      parsedCertificateMock.thumbprint,
      `
      <?xml version="1.0" encoding="UTF-8"?>
      <!--
       Original XML doc file for sign example.
      -->
      <Envelope xmlns="urn:envelope">
          <Data>
              Hello, World!
          </Data>
          <Node xml:id="nodeID">
              Hello, Node!
          </Node>
      
      </Envelope>
    `,
    );

    expect(signature).toEqual('signature');
  });
});
