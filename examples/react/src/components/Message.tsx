import { useEffect, useState } from 'react';

interface Props {
  onChange: (message: string) => void;
}

function Message({ onChange }: Props) {
  const [message, setMessage] = useState('Привет мир!');

  function onMessageChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(event.target.value);
    onChange(event.target.value);
  }

  useEffect(() => onChange(message), []);

  return (
    <>
      <legend>Создание подписи</legend>

      <label htmlFor="message">Подписываемое сообщение: *</label>

      <br/>

      <textarea
        id="message"
        name="message"
        cols={80}
        rows={5}
        placeholder="Введите сообщение"
        value={message}
        onChange={onMessageChange}
        autoFocus
        required/>
    </>
  );
}

export default Message;