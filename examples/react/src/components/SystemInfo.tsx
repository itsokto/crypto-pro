import { useState, useEffect } from 'react';
import { getSystemInfo, isValidSystemSetup } from 'crypto-pro-browser';

function SystemInfo() {
  const [systemInfo, setSystemInfo] = useState<Record<string, unknown> | null>(null);
  const [systemInfoError, setSystemInfoError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setSystemInfo({
          ...await getSystemInfo(),
          isValidSystemSetup: await isValidSystemSetup(),
        });
      } catch (error) {
        setSystemInfoError((error as Error).message);
      }
    })();
  }, []);

  return (
    <pre>
      {systemInfo ? (
        JSON.stringify(systemInfo, null, '  ')
      ) : (
        systemInfoError
      )}
    </pre>
  );
}

export default SystemInfo;