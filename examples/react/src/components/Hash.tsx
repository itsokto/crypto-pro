interface Props {
  hash: string;
  hashStatus: string;
  hashError: string | null;
}

function Hash({ hash, hashStatus, hashError }: Props) {
  return (
    <>
      <legend>Результат</legend>

      <label htmlFor="hash">Хеш (ГОСТ Р 34.11-2012 256 бит):</label>

      <br/>

      <textarea
        id="hash"
        cols={80}
        rows={5}
        value={hash}
        placeholder={hashStatus}
        readOnly/>

      <pre>{hashError}</pre>
    </>
  );
}

export default Hash;