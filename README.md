[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][downloads-url]
[![CI][ci-image]][ci-url]
[![Coverage][coverage-image]][coverage-url]
[![License][license-image]][license-url]

<a name="cryptopro"></a>
# crypto-pro-browser
Единое, асинхронное API для взаимодействия с КриптоПРО ЭЦП Browser Plug-In

| [![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_64x64.png)](https://www.google.com/chrome/) | [![Yandex Browser](https://raw.githubusercontent.com/alrra/browser-logos/main/src/yandex/yandex_64x64.png)](https://browser.yandex.ru/) | [![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_64x64.png)](https://www.mozilla.org/firefox/) | [![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_64x64.png)](https://www.opera.com/) |
| ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| с расширением [CryptoPro Extension for CAdES Browser Plug-in](https://chromewebstore.google.com/detail/extension-for-cades-brows/pfhgbfnnjiafkhfdkmpiflachepdcjod) | с расширением [CryptoPro Extension for CAdES Browser Plug-in](https://chromewebstore.google.com/detail/extension-for-cades-brows/pfhgbfnnjiafkhfdkmpiflachepdcjod) | с [расширением](https://www.cryptopro.ru/products/cades/plugin) | с расширением [CryptoPro Extension for CAdES Browser Plug-in](https://addons.opera.com/en/extensions/details/cryptopro-extension-for-cades-browser-plug-in/) |

- [crypto-pro-browser](#cryptopro)
    - [Установка](#install)
    - [API](#api)
        - [Методы объекта cryptoPro](#api-cryptopro)
        - [Методы объекта сертификата](#api-certificate)
    - [Поддерживаемые СКЗИ](#supported-cist)
    - [Примеры](#examples)
        - [Тэг script (UMD)](#example-script-tag)
        - [Angular (ES Modules + Typescript)](#example-angular)
        - [React (ES Modules + JavaScript)](#example-react)
- [Тем, кто хочет помочь](#developers)
    - [Запуск режима разработки](#dev-mode)
    - [Запуск тестов](#tests-execution)
- [Полезная информация](#helpful)
- [Лицензия](#license)

<a name="install"></a>
## Установка
Для NPM:
```bash
npm install crypto-pro-browser
```

Для Yarn:
```bash
yarn add crypto-pro-browser
```

Подключение пакета как UMD модуля через тэг script:
```html
<script src="crypto-pro-browser/dist/crypto-pro-browser.umd.js"></script>
<script>
window.cryptoPro.getUserCertificates()
  .then(function (certificates) {
    //...
  })
  .catch(function (error) {
    //...
  });
</script>
```

Подключение пакета как ES модуля с Typescript или JavaScript:
```typescript
import { getUserCertificates, Certificate } from 'crypto-pro-browser';

(async () => {
  let certificates: Certificate[];

  try {
    certificates = await getUserCertificates();
  } catch(error) {
    // ...
  }
})();
```

<a name="api"></a>
## API

<a name="api-cryptopro"></a>
### Методы объекта cryptoPro
- [getUserCertificates](src/api/getUserCertificates.ts) - возвращает список [сертификатов](#api-certificate), доступных пользователю в системе
- [getCertificate](src/api/getCertificate.ts) - возвращает [сертификат](#api-certificate) по отпечатку
- [createAttachedSignature](src/api/createAttachedSignature.ts) - создает совмещенную (присоединенную) подпись сообщения
- [createDetachedSignature](src/api/createDetachedSignature.ts) - создает отсоединенную (открепленную) подпись сообщения
- [createXMLSignature](src/api/createXMLSignature.ts) - создает XML подпись для документа в формате XML
- [createHash](src/api/createHash.ts) - создает хеш сообщения по ГОСТ Р 34.11-2012 256 бит
- [createSignature](src/api/createSignature.ts) - создает подпись сообщения
    > Является устаревшим и будет убран из будущих версий.
    Используйте "createAttachedSignature" и "createDetachedSignature".
- [getSystemInfo](src/api/getSystemInfo.ts) - возвращает информацию о CSP и плагине
- [isValidSystemSetup](src/api/isValidSystemSetup.ts) - возвращает флаг корректности настроек ЭП на машине
- [execute](src/api/execute.ts) - выполняет переданный колбэк, предоставляя доступ к объекту `cadesplugin` и вспомогательным утилитам

<a name="api-certificate"></a>
### Методы объекта сертификата
[Сертификат](src/api/certificate/certificate.ts) предоставляет следущее API:
- [isValid](src/api/certificate/isValid.ts) - возвращает флаг действительности сертификата
- [getCadesProp](src/api/certificate/getCadesProp.ts) - возвращает указанное внутренее свойство у сертификата в формате Cades
- [exportBase64](src/api/certificate/exportBase64.ts) - возвращает сертификат в формате base64
- [getAlgorithm](src/api/certificate/getAlgorithm.ts) - возвращает информацию об алгоритме сертификата
- [getOwnerInfo](src/api/certificate/getInfo.ts) - возвращает расшифрованную информацию о владельце сертификата
- [getIssuerInfo](src/api/certificate/getInfo.ts) - возвращает расшифрованную информацию об издателе сертификата
- [getExtendedKeyUsage](src/api/certificate/getExtendedKeyUsage.ts) - возвращает ОИД'ы сертификата
- [getDecodedExtendedKeyUsage](src/api/certificate/getDecodedExtendedKeyUsage.ts) - возвращает расшифрованные ОИД'ы
- [hasExtendedKeyUsage](src/api/certificate/hasExtendedKeyUsage.ts) - проверяет наличие ОИД'а (ОИД'ов) у сертификата

<a name="supported-cist"></a>
## Поддерживаемые СКЗИ
[КриптоПРО CSP](https://www.cryptopro.ru/products/csp/downloads) (v4.0+) *рекомендуется использование только сертифицированных версий*. Инструкция по установке:
- [Linux / OSX](#csp-install-linux-osx)
- (в Windows следуйте указаниям программы-установщика)

[КриптоПРО ЭЦП browser plug-in](https://www.cryptopro.ru/products/cades/plugin) (v2.0.12438+).

[Инструкция](#plugin-install-linux) по установке плагина в Linux. В Windows и OSX следуйте указаниям программы-установщика.

[Инструкция](#certificates-install-linux) по установке сертификатов в систему для Linux / OSX.

<a name="examples"></a>
## Примеры
Для их запуска необходим NodeJS версии, указанной в [.nvmrc](.nvmrc).

<a name="example-script-tag"></a>
### Тэг script (UMD)
```bash
cd examples/script-tag
npm i
npm start
```

<a name="example-angular"></a>
### Angular (ES Modules + Typescript)
```bash
cd examples/angular
npm i
```

Запуск в режиме разработки:
```bash
npm start
```

Запуск в продакшн режиме:
```bash
npm run build
npm run serve
```

<a name="example-react"></a>
### React (ES Modules + JavaScript)
```bash
cd examples/react
npm i
```

Запуск в режиме разработки:
```bash
npm start
```

Запуск в продакшн режиме:
```bash
npm run build
npm run serve
```

<a name="developers"></a>
# Тем, кто хочет помочь
Буду благодарен за расширение/улучшение/доработку API.
Вам будут полезны [примеры](http://cpdn.cryptopro.ru/?url=/content/cades/plugin-samples-sign.html),
предоставляемые Крипто ПРО.

Необходима NodeJS версии, указанной в [.nvmrc](.nvmrc).

<a name="dev-mode"></a>
## Запуск режима разработки
Устанавливаем зависимости:
```bash
npm i
```

Во время работы с кодом необходим запущенный сборщик:
```bash
npm run dev
```

<a name="tests-execution"></a>
## Запуск тестов
Тесты написаны с использованием [Vitest](https://vitest.dev/):
```bash
npm test
```

<a name="helpful"></a>
# Полезная информация

## Установка КриптоПРО CSP
Загрузите дистрибутив и следуйте официальной инструкции по установке:
[https://www.cryptopro.ru/products/csp/downloads](https://www.cryptopro.ru/products/csp/downloads)

## Установка КриптоПРО ЭЦП browser plug-in
Загрузите плагин и следуйте официальной инструкции по установке:
[https://www.cryptopro.ru/products/cades/plugin](https://www.cryptopro.ru/products/cades/plugin)

<a name="license"></a>
# Лицензия
MIT

[npm-url]: https://npmjs.org/package/crypto-pro-browser
[npm-version-image]: https://img.shields.io/npm/v/crypto-pro-browser.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/crypto-pro-browser.svg?style=flat
[downloads-url]: https://npmcharts.com/compare/crypto-pro-browser?minimal=true
[license-image]: https://img.shields.io/npm/l/crypto-pro-browser.svg?style=flat
[license-url]: https://github.com/itsokto/crypto-pro/blob/master/LICENSE
[ci-image]: https://github.com/itsokto/crypto-pro/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/itsokto/crypto-pro/actions/workflows/ci.yml
[coverage-image]: https://codecov.io/gh/itsokto/crypto-pro/branch/master/graph/badge.svg
[coverage-url]: https://codecov.io/gh/itsokto/crypto-pro
