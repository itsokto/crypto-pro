import { _afterPluginsLoaded } from '../helpers/_afterPluginsLoaded';
import { _extractMeaningfulErrorMessage } from '../helpers/_extractMeaningfulErrorMessage';

/**
 * Выполняет переданную функцию с доступом к Cades плагину
 *
 * @param {callback} callback - функция, использующая низкоуровневый доступ к Cades плагину
 *
 * @returns асинхронный результат выполнения передаваемой функции
 */
export const execute = _afterPluginsLoaded(
  async (
    callback: (exposedAPI: {
      cadesplugin: any;
      _extractMeaningfulErrorMessage: (error: Error) => string | null;
    }) => any,
  ): Promise<any> =>
    await callback({
      cadesplugin: window.cadesplugin,
      _extractMeaningfulErrorMessage,
    }),
);
