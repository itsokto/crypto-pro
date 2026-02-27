import { describe, test, expect } from 'vitest';
import { getCadesProp } from './getCadesProp';

const cadesPropertyContentMock = 'content of a cades property';

const executionSteps = [Symbol('step 0')];

const executionFlow = {
  [executionSteps[0]]: cadesPropertyContentMock,
};

describe('getCadesProp', () => {
  test('returns contents of a cades prop', async () => {
    window.cadesplugin.__defineExecutionFlow(executionFlow);

    const cadesPropertyContent = await getCadesProp.call(
      {
        _cadesCertificate: {
          cadesProperty: executionSteps[0],
        },
      },
      'cadesProperty',
    );

    expect(cadesPropertyContent).toEqual(cadesPropertyContentMock);
  });
});
