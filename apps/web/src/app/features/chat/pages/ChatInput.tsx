import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Props = {
  onSend: (content: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHAR = 300;

  const send = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed.replace(/\n/g, "").trim()) {
      onSend(trimmed);
      setText("");
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t bg-white p-4 dark:bg-dark-secondary">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none rounded-l border py-2 px-3 outline-none max-h-40 overflow-y-auto"
          placeholder="Type your message…"
          value={text}
          maxLength={MAX_CHAR}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ minHeight: "40px",}}
        />
        <button
          onClick={send}
          disabled={!text.trim() || !text.replace(/\n/g, "").trim()}
          className={`rounded-r  h-[40px] px-4 py-2 text-white transition-colors ${
            !text.trim() || !text.replace(/\n/g, "").trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <Send />
        </button>
      </div>
      <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-300">
        {text.length}/{MAX_CHAR}
      </div>
    </div>
  );
}
