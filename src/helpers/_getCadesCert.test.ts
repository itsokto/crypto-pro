import { describe, test, expect, vi } from 'vitest';
import 'cadesplugin';
import { CadesCertificate } from '../api/certificate';
import { _getCadesCert } from './_getCadesCert';

const certificateMock = {
  IssuerName: 'no matter',
  SubjectName: 'no matter',
  Thumbprint: 'some thumbprint',
  ValidFromDate: 'whatever',
  ValidToDate: 'whatever',
};

const executionSteps = [Symbol('step 0'), Symbol('step 1'), Symbol('step 2'), Symbol('step 3'), Symbol('step 4')];

const executionFlow = {
  [executionSteps[0]]: {
    Certificates: executionSteps[1],
    Close: vi.fn(),
    Open: vi.fn(),
  },
  [executionSteps[1]]: {
    Count: executionSteps[3],
    Find: vi.fn().mockReturnValue(executionSteps[2]),
  },
  [executionSteps[2]]: {
    Count: executionSteps[3],
    Item: vi.fn().mockReturnValue(executionSteps[4]),
  },
  [executionSteps[3]]: 1,
  [executionSteps[4]]: {
    IssuerName: certificateMock.IssuerName,
    SubjectName: certificateMock.SubjectName,
    Thumbprint: certificateMock.Thumbprint,
    ValidFromDate: certificateMock.ValidFromDate,
    ValidToDate: certificateMock.ValidToDate,
  },
};

window.cadesplugin.__defineExecutionFlow(executionFlow);
window.cadesplugin.CreateObjectAsync.mockImplementation(() => executionSteps[0]);

describe('_getCadesCert', () => {
  test('returns certificate by a thumbprint', async () => {
    const certificate: CadesCertificate = await _getCadesCert(certificateMock.Thumbprint);

    expect(certificate).toStrictEqual(certificateMock);
  });
});
