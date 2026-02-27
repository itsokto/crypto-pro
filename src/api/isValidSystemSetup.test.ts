import { describe, test, expect, beforeEach, vi, Mock } from 'vitest';


import { isValidSystemSetup } from './isValidSystemSetup';
import { getSystemInfo } from './getSystemInfo';
import { _isSupportedCadesVersion } from '../helpers/_isSupportedCadesVersion';
import { _isSupportedCSPVersion } from '../helpers/_isSupportedCSPVersion';

vi.mock('./getSystemInfo', () => ({ getSystemInfo: vi.fn() }));
vi.mock('../helpers/_isSupportedCadesVersion', () => ({ _isSupportedCadesVersion: vi.fn() }));
vi.mock('../helpers/_isSupportedCSPVersion', () => ({ _isSupportedCSPVersion: vi.fn() }));

beforeEach(() => {
  (getSystemInfo as Mock).mockClear();
  (_isSupportedCadesVersion as Mock).mockClear();
  (_isSupportedCSPVersion as Mock).mockClear();
});

describe('isValidSystemSetup', () => {
  (getSystemInfo as Mock).mockImplementation(() => ({
    cadesVersion: '2.0.13771',
    cspVersion: '4.0.9971',
  }));
  (_isSupportedCadesVersion as Mock).mockImplementation(() => true);
  (_isSupportedCSPVersion as Mock).mockImplementation(() => true);

  describe('positive scenario', () => {
    test("calls getSystemInfo to verify that it's possible", async () => {
      await isValidSystemSetup();

      expect(getSystemInfo).toHaveBeenCalledTimes(1);
    });

    test('checks for validity using separate external helpers', async () => {
      await isValidSystemSetup();

      expect(_isSupportedCadesVersion).toHaveBeenCalledTimes(1);
      expect(_isSupportedCSPVersion).toHaveBeenCalledTimes(1);
    });
  });

  describe('negative scenario', () => {
    test('throws error from getSystemInfo', async () => {
      const errorMessage = 'Какая-то синтаксическая ошибка';
      const vendorErrorMessage = 'Произошла ошибка из-за какой-то проблемы';

      (getSystemInfo as Mock).mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
      (window.cadesplugin.getLastError as Mock).mockImplementationOnce(() => new Error(vendorErrorMessage));

      await expect(isValidSystemSetup()).rejects.toThrowError(vendorErrorMessage);
    });

    test('throws error if cades version is unsupported', async () => {
      (_isSupportedCadesVersion as Mock).mockImplementationOnce(() => false);

      await expect(isValidSystemSetup()).rejects.toThrowError('Не поддерживаемая версия плагина');
    });

    test('throws error if CSP version is unsupported', async () => {
      (_isSupportedCSPVersion as Mock).mockImplementationOnce(() => false);

      await expect(isValidSystemSetup()).rejects.toThrowError('Не поддерживаемая версия CSP');
    });
  });
});
