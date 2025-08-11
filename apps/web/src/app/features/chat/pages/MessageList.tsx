import { useRef, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { User as UserIcon } from "lucide-react"; // Assuming this is the icon you're using
import Image from "../../../components/ui/images";

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
  console.log(hasMore)

console.log(messages.length)
  return (
    <div id="scrollableDiv"  ref={containerRef} style={{ height: 520, overflow: "auto" }}>
     {scrollParent&&( <InfiniteScroll
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
              className={`flex gap-2 mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              {!isOwnMessage && (
                sender?.profileUrl ? (
                  <Image
                    src={sender.profileUrl}
                    alt={sender?.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 rounded-full self-center text-gray-500 dark:text-white" />
                )
              )}

              <div
               
              >
                <p className={`text-xs  font-semibold mb-1 text-gray-600 dark:text-gray-300 ${
                  isOwnMessage ? "text-right ":""} `}>
                  {sender?.name || "Unknown"}
                </p>
                <p  className={` p-3 rounded-xl min-w-[100px] ${
                  isOwnMessage ? "bg-blue-300 dark:bg-blue-400  " : "bg-gray-300 dark:bg-gray-400"
                }`}>{msg.content}</p>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>)}
    </div>
  );
}
