import { Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (content: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const send = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <div className="border-t bg-white p-4 dark:bg-dark-secondary">
      <div className="flex">
        <input
          className="flex-1 rounded-l border py-2 px-3 outline-none"
          placeholder="Type your message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="rounded-r bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Send/>
        </button>
      </div>
    </div>
  );
}
