import React, { useState } from "react";
import "./forum.css";

export interface ReplyInputProps {
  onSubmit: (text: string) => void;
}

export const ReplyInput: React.FC<ReplyInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(text);
    setText("");
  };

  return (
    <form className="d-flex row w-100 m-0 gap-2" onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="input-reply-box"/>
      <button className="send-btn">Send</button>
    </form>
  );
};
