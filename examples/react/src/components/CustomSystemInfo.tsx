import { useState, useEffect } from 'react';
import { execute } from 'crypto-pro-browser';

function CustomSystemInfo() {
  const [customSystemInfo, setCustomSystemInfo] = useState<string | null>(null);
  const [customSystemInfoError, setCustomSystemInfoError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider
        const providerType = 75;

        setCustomSystemInfo(await execute(({ cadesplugin, _extractMeaningfulErrorMessage }) => {
          return cadesplugin.async_spawn(function* getVersion(): Generator {
            try {
              const cadesAbout = yield cadesplugin.CreateObjectAsync('CAdESCOM.About');
              const providerName = yield cadesAbout.CSPName();
              const cadesVersion = yield cadesAbout.CSPVersion(providerName, providerType);
              const minor = yield cadesVersion.MinorVersion;
              const major = yield cadesVersion.MajorVersion;
              const build = yield cadesVersion.BuildVersion;
              const version = yield cadesVersion.toString();

              return [
                providerName,
                [major, minor, build].join('.'),
                version,
              ].join(', ');
            } catch (error) {
              console.error(error);

              throw new Error(
                _extractMeaningfulErrorMessage(error as Error) || 'Ошибка при извлечении информации',
              );
            }
          });
        }));
      } catch (error) {
        setCustomSystemInfoError((error as Error).message);
      }
    })();
  }, []);

  return (
    <pre>
      {customSystemInfo ? (
        JSON.stringify(customSystemInfo, null, '  ')
      ) : (
        customSystemInfoError
      )}
    </pre>
  );
}

export default CustomSystemInfo;