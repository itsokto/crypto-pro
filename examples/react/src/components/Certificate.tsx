import { useState, useEffect } from 'react';
import { type Certificate, getCertificate, getUserCertificates } from 'crypto-pro-browser';

interface Props {
  onChange: (certificate: Certificate | undefined) => void;
}

function CertificateSelect({ onChange }: Props) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificatesError, setCertificatesError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [certificateDetails, setCertificateDetails] = useState<Record<string, unknown> | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  function selectCertificate(event: React.ChangeEvent<HTMLSelectElement>) {
    const cert = certificates.find(({ thumbprint }) => thumbprint === event.target.value);

    setCertificate(cert ?? null);
    onChange(cert);
  }

  async function loadCertificateDetails(thumbprint: string) {
    try {
      const cert = await getCertificate(thumbprint);

      setCertificateDetails({
        name: cert.name,
        issuerName: cert.issuerName,
        subjectName: cert.subjectName,
        thumbprint: cert.thumbprint,
        validFrom: cert.validFrom,
        validTo: cert.validTo,
        isValid: await cert.isValid(),
        version: await cert.getCadesProp('Version'),
        base64: await cert.exportBase64(),
        algorithm: await cert.getAlgorithm(),
        extendedKeyUsage: await cert.getExtendedKeyUsage(),
        ownerInfo: await cert.getOwnerInfo(),
        issuerInfo: await cert.getIssuerInfo(),
        decodedExtendedKeyUsage: await cert.getDecodedExtendedKeyUsage(),
        '1.3.6.1.4.1.311.80.1': await cert.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.1'),
        '[\'1.3.6.1.5.5.7.3.2\', \'1.3.6.1.4.1.311.10.3.12\']': await cert.hasExtendedKeyUsage([
          '1.3.6.1.5.5.7.3.2',
          '1.3.6.1.4.1.311.10.3.12',
        ]),
        '1.3.6.1.4.1.311.80.2': await cert.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.2'),
        '\'1.3.6.1.5.5.7.3.3\', \'1.3.6.1.4.1.311.10.3.12\'': await cert.hasExtendedKeyUsage([
          '1.3.6.1.5.5.7.3.3',
          '1.3.6.1.4.1.311.10.3.12',
        ]),
      });
    } catch (error) {
      setDetailsError((error as Error).message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setCertificates(await getUserCertificates());
      } catch (error) {
        setCertificatesError((error as Error).message);
      }
    })();
  }, []);

  return (
    <>
      <label htmlFor="certificate">Сертификат: *</label>

      <br/>

      <select id="certificate" onChange={selectCertificate}>
        <option defaultValue={undefined}>Не выбран</option>

        {certificates.map(({ name, thumbprint, validTo }) =>
          <option key={thumbprint} value={thumbprint}>
            {name + ' (действителен до: ' + validTo + ')'}
          </option>
        )}
      </select>

      <pre>{certificatesError}</pre>

      {certificate ? (
        <>
          <details
            onClick={() => loadCertificateDetails(certificate.thumbprint)}>
            <summary>Информация о сертификате</summary>

            <pre>
              {certificateDetails ? (
                JSON.stringify(certificateDetails, null, '  ')
              ) : 'Запрашивается...'}
            </pre>
          </details>

          <pre>{detailsError}</pre>
        </>
      ) : null}
    </>
  );
}

export default CertificateSelect;
