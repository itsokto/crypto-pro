import { describe, test, expect, beforeEach } from 'vitest';
import 'cadesplugin';
import { __cadesAsyncToken__, __createCadesPluginObject__, _generateCadesFn } from './_generateCadesFn';

const CreateObjectAsync = window.cadesplugin.CreateObjectAsync;

describe('_generateCadesFn', () => {
  describe('synchronous environment', () => {
    beforeEach(() => {
      delete window.cadesplugin.CreateObjectAsync;
    });

    test('generates function body from named function callback', () => {
      const result = _generateCadesFn(function namedFunction() {
        console.log('hello from named function');
      });

      expect(result).toContain('console.log("hello from named function")');
      expect(result).toContain('sourceURL=crypto-pro_namedFunction.js');
      expect(result).toMatch(/^\(function anonymous\(/);
      expect(result).toContain('();//# sourceURL=');
    });

    test('generates function body from arrow function callback', () => {
      const result = _generateCadesFn(() => console.log('hello from arrow function'));

      expect(result).toContain('console.log("hello from arrow function")');
      expect(result).toContain('sourceURL=crypto-pro_dynamicFn.js');
    });

    test('generates function body with synchronous vendor library references', () => {
      const result = _generateCadesFn(function methodInSyncEnvironment() {
        const cadesFoo = __cadesAsyncToken__ + __createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = __cadesAsyncToken__ + __createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = __cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(result).toContain('cadesplugin.CreateObject("CADESCOM.Foo")');
      expect(result).toContain('cadesplugin.CreateObject("CAdESCOM.Bar")');
      expect(result).not.toContain('__cadesAsyncToken__');
      expect(result).not.toContain('__createCadesPluginObject__');
      expect(result).toContain('cadesFoo.WhateverProperty = "whatever value"');
      expect(result).toContain('cadesBarNoMatterWhat.whateverMethod(cadesFoo)');
      expect(result).toContain('();//# sourceURL=crypto-pro_methodInSyncEnvironment.js');
      expect(result).not.toContain('yield');
    });

    test('generates function body for synchronous custom implementation', () => {
      const result = _generateCadesFn(function customSyncEnvImplementation(utils) {
        const cadesFoo = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = utils.__cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (utils.__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (utils.__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(result).toContain('cadesplugin.CreateObject("CADESCOM.Foo")');
      expect(result).toContain('cadesplugin.CreateObject("CAdESCOM.Bar")');
      expect(result).not.toContain('__cadesAsyncToken__');
      expect(result).not.toContain('__createCadesPluginObject__');
      expect(result).toContain('cadesFoo.WhateverProperty = "whatever value"');
      expect(result).toContain('();//# sourceURL=crypto-pro_customSyncEnvImplementation.js');
      expect(result).not.toContain('yield');
    });
  });

  describe('asynchronous environment', () => {
    beforeEach(() => {
      window.cadesplugin.CreateObjectAsync = CreateObjectAsync;
    });

    test('generates function body with asynchronous vendor library references', () => {
      const result = _generateCadesFn(function methodInAsyncEnvironment() {
        const cadesFoo = __cadesAsyncToken__ + __createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = __cadesAsyncToken__ + __createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = __cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(result).toMatch(/^cadesplugin\.async_spawn\(function\* anonymous\(/);
      expect(result).toContain('yield cadesplugin.CreateObjectAsync("CADESCOM.Foo")');
      expect(result).toContain('yield cadesplugin.CreateObjectAsync("CAdESCOM.Bar")');
      expect(result).toContain('yield cadesBar.NoMatterWhat');
      expect(result).not.toContain('__cadesAsyncToken__');
      expect(result).not.toContain('__createCadesPluginObject__');
      expect(result).toContain('yield cadesFoo.propset_WhateverProperty("whatever value")');
      expect(result).toContain('yield cadesBarNoMatterWhat.whateverMethod(cadesFoo)');
      expect(result).toContain(';//# sourceURL=crypto-pro_methodInAsyncEnvironment.js');
    });

    test('generates function body for asynchronous custom implementation', () => {
      const result = _generateCadesFn(function customAsyncEnvImplementation(utils) {
        const cadesFoo = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CADESCOM.Foo');
        const cadesBar = utils.__cadesAsyncToken__ + utils.__createCadesPluginObject__('CAdESCOM.Bar');
        const cadesBarNoMatterWhat = utils.__cadesAsyncToken__ + cadesBar.NoMatterWhat;
        void (utils.__cadesAsyncToken__ + cadesFoo.propset_WhateverProperty('whatever value'));
        void (utils.__cadesAsyncToken__ + cadesBarNoMatterWhat.whateverMethod(cadesFoo));
      });

      expect(result).toMatch(/^cadesplugin\.async_spawn\(function\* anonymous\(utils/);
      expect(result).toContain('yield cadesplugin.CreateObjectAsync("CADESCOM.Foo")');
      expect(result).toContain('yield cadesplugin.CreateObjectAsync("CAdESCOM.Bar")');
      expect(result).not.toContain('__cadesAsyncToken__');
      expect(result).not.toContain('__createCadesPluginObject__');
      expect(result).toContain('yield cadesFoo.propset_WhateverProperty("whatever value")');
      expect(result).toContain(';//# sourceURL=crypto-pro_customAsyncEnvImplementation.js');
    });
  });
});
