import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';
import { ISSUER_TAGS_TRANSLATIONS } from '../../constants';
import { getInfo } from './getInfo';
import { getCadesProp } from './getCadesProp';
import { _parseCertInfo } from '../../helpers/_parseCertInfo';

const entitiesPathMock = 'path to entities';
const entitiesMock = 'info about the entities';
const certificateInfoMock = [
  {
    description: 'description',
    title: 'title',
    isTranslated: true,
  },
];

vi.mock('./getCadesProp', () => ({ getCadesProp: vi.fn(() => entitiesMock) }));
vi.mock('../../helpers/_parseCertInfo', () => ({ _parseCertInfo: vi.fn(() => certificateInfoMock) }));

beforeEach(() => {
  (getCadesProp as Mock).mockClear();
  (_parseCertInfo as Mock).mockClear();
});

describe('getInfo', () => {
  test('calls external APIs to get information about the certificate', async () => {
    const certificateInfo = await getInfo(ISSUER_TAGS_TRANSLATIONS, entitiesPathMock);

    expect(getCadesProp).toHaveBeenCalledTimes(1);
    expect(getCadesProp).toHaveBeenCalledWith(entitiesPathMock);
    expect(_parseCertInfo).toHaveBeenCalledTimes(1);
    expect(_parseCertInfo).toHaveBeenCalledWith(ISSUER_TAGS_TRANSLATIONS, entitiesMock);
    expect(certificateInfo).toStrictEqual(certificateInfoMock);
  });
});
