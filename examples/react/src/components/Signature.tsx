interface Props {
  signature: string;
  signatureStatus: string;
  signatureError: string | null;
}

function Signature({ signature, signatureStatus, signatureError }: Props) {
  return (
    <>
      <label htmlFor="signature">Подпись (PKCS7):</label>

      <br/>

      <textarea
        id="signature"
        cols={80}
        rows={30}
        value={signature}
        placeholder={signatureStatus}
        readOnly/>

      <pre>{signatureError}</pre>
    </>
  );
}

export default Signature;