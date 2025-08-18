import { useRef, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { User as UserIcon } from "lucide-react"; // Assuming this is the icon you're using
import Image from "../../../components/ui/images";
import moment from "moment/moment";

type Props = {
  messages: any[];
  userId?: string;
  loadMore: () => void;
  hasMore: boolean;
};

export default function MessageList({
  messages,
  userId,
  loadMore,
  hasMore,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

  // Attach scrollable target after mount
  useEffect(() => {
    if (containerRef.current) {
      setScrollParent(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const isNewMessage =
      Date.now() - new Date(lastMessage.createdAt).getTime() < 2000;

    const scrollBehavior = isNewMessage ? "smooth" : "auto";

    // Always scroll to bottom, animate only if it's a new message
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: scrollBehavior,
    });
  }, [messages]);
  return (
    <div
      id="scrollableDiv"
      ref={containerRef}
      style={{ height: 520, overflow: "auto" }}
    >
      {scrollParent && (
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMore}
          hasMore={hasMore}
          inverse={true}
          scrollThreshold={1}
          loader={<p className="text-center">Loading older messages…</p>}
          scrollableTarget="scrollableDiv"
        >
          {messages.map((msg) => {
            const sender = msg.sender ?? msg.organization;
            const isOwnMessage = msg.userId === userId;

return (
  <div
    key={msg.id}
    className={`flex gap-2 mb-3 ${
      isOwnMessage ? "justify-end" : "justify-start"
    }`}
  >
    {/* Avatar - shown only for other users */}
    {!isOwnMessage &&
      (sender?.profileUrl ? (
        <Image
          src={sender.profileUrl}
          alt={sender?.name || "User"}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover self-end"
        />
      ) : (
        <UserIcon className="h-8 w-8 rounded-full self-end text-gray-500 dark:text-white" />
      ))}

    {/* Message Bubble */}
    <div
      className={`p-3 rounded-xl min-w-[100px] max-w-xs sm:max-w-sm md:max-w-md break-words ${
        isOwnMessage
          ? "bg-blue-300 dark:bg-blue-400"
          : "bg-gray-300 dark:bg-gray-400"
      }`}
    >
      {/* Sender Name */}
      <p
        className={`text-xs font-semibold mb-1 ${
          isOwnMessage
            ? "text-right text-gray-700 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {isOwnMessage ? "You" : sender?.name || "Unknown"}
      </p>

      {/* Message Content - Multiline Support */}
      <p className="text-sm text-gray-800 dark:text-white mb-1 whitespace-pre-wrap">
        {msg.content}
      </p>

      {/* Timestamp */}
      <p className="text-[10px] text-gray-500 dark:text-gray-200 text-right mt-1">
        {moment(msg.createdAt).fromNow()}
      </p>
    </div>
  </div>
);


          })}
        </InfiniteScroll>
      )}
    </div>
  );
}
