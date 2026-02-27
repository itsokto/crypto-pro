import { describe, test, expect, vi } from 'vitest';
import { exportBase64 } from './exportBase64';

const exportedCertificateMock = 'certificate as base64';

const executionSteps = [Symbol('step 0')];

const executionFlow = {
  [executionSteps[0]]: exportedCertificateMock,
};

describe('exportBase64', () => {
  test('returns exported certificate', async () => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);

    const certificateAsBase64 = await exportBase64.call({
      _cadesCertificate: {
        Export: vi.fn(() => executionSteps[0]),
      },
    });

    expect(certificateAsBase64).toEqual(exportedCertificateMock);
  });
});
