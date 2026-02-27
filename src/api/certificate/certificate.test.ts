import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';
import { parsedCertificates } from '../../mocks/certificates';
import { ISSUER_TAGS_TRANSLATIONS, SUBJECT_TAGS_TRANSLATIONS } from '../../constants';
import { exportBase64 } from './exportBase64';
import { getAlgorithm } from './getAlgorithm';
import { getCadesProp } from './getCadesProp';
import { getDecodedExtendedKeyUsage } from './getDecodedExtendedKeyUsage';
import { getExtendedKeyUsage } from './getExtendedKeyUsage';
import { getInfo } from './getInfo';
import { hasExtendedKeyUsage } from './hasExtendedKeyUsage';
import { isValid } from './isValid';
import { Certificate } from './certificate';

const [parsedCertificateMock] = parsedCertificates;
const oidsMock = ['oid 1', 'oid 2'];

vi.mock('./isValid', () => ({ isValid: vi.fn(() => 'isValid') }));
vi.mock('./getCadesProp', () => ({ getCadesProp: vi.fn(() => 'getCadesProp') }));
vi.mock('./exportBase64', () => ({ exportBase64: vi.fn(() => 'exportBase64') }));
vi.mock('./getAlgorithm', () => ({ getAlgorithm: vi.fn(() => 'getAlgorithm') }));
vi.mock('./getInfo', () => ({ getInfo: vi.fn(() => 'getInfo') }));
vi.mock('./getExtendedKeyUsage', () => ({ getExtendedKeyUsage: vi.fn(() => 'getExtendedKeyUsage') }));
vi.mock('./getDecodedExtendedKeyUsage', () => ({
  getDecodedExtendedKeyUsage: vi.fn(() => 'getDecodedExtendedKeyUsage'),
}));
vi.mock('./hasExtendedKeyUsage', () => ({ hasExtendedKeyUsage: vi.fn(() => 'hasExtendedKeyUsage') }));

beforeEach(() => {
  (isValid as Mock).mockClear();
  (getCadesProp as Mock).mockClear();
  (exportBase64 as Mock).mockClear();
  (getAlgorithm as Mock).mockClear();
  (getInfo as Mock).mockClear();
  (getExtendedKeyUsage as Mock).mockClear();
  (getDecodedExtendedKeyUsage as Mock).mockClear();
  (hasExtendedKeyUsage as Mock).mockClear();
});

const certificate = new Certificate(
  null,
  parsedCertificateMock.name,
  parsedCertificateMock.issuerName,
  parsedCertificateMock.subjectName,
  parsedCertificateMock.thumbprint,
  parsedCertificateMock.validFrom,
  parsedCertificateMock.validTo,
);

describe('getInfo', () => {
  test("calls external APIs for each method and passes it's results outside", async () => {
    expect(certificate.isValid()).toEqual('isValid');
    expect(isValid).toHaveBeenCalledTimes(1);
    expect(certificate.getCadesProp('property name')).toEqual('getCadesProp');
    expect(getCadesProp).toHaveBeenCalledWith('property name');
    expect(certificate.exportBase64()).toEqual('exportBase64');
    expect(exportBase64).toHaveBeenCalledTimes(1);
    expect(certificate.getAlgorithm()).toEqual('getAlgorithm');
    expect(getAlgorithm).toHaveBeenCalledTimes(1);
    expect(certificate.getOwnerInfo()).toEqual('getInfo');
    expect(getInfo).toHaveBeenCalledWith(SUBJECT_TAGS_TRANSLATIONS, 'SubjectName');
    expect(certificate.getIssuerInfo()).toEqual('getInfo');
    expect(getInfo).toHaveBeenCalledWith(ISSUER_TAGS_TRANSLATIONS, 'IssuerName');
    expect(certificate.getExtendedKeyUsage()).toEqual('getExtendedKeyUsage');
    expect(getExtendedKeyUsage).toHaveBeenCalledTimes(1);
    expect(certificate.getDecodedExtendedKeyUsage()).toEqual('getDecodedExtendedKeyUsage');
    expect(getDecodedExtendedKeyUsage).toHaveBeenCalledTimes(1);
    expect(certificate.hasExtendedKeyUsage(oidsMock)).toEqual('hasExtendedKeyUsage');
    expect(hasExtendedKeyUsage).toHaveBeenCalledWith(oidsMock);
  });
});
