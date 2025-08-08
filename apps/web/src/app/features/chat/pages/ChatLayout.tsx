import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import OnlineMembers from "./OnlineMembers";
import { useChat } from "../useChat";

type Props = {
  orgId: string;
  userId: string;
};

export function ChatLayout({ orgId, userId }: Props) {
  const { messages, send, loadMore, hasMore, onlineMembers } = useChat(
    orgId,
    userId
  );

  return (
    <div className="flex h-full w-full bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 border-r bg-white dark:bg-dark-secondary">
        <OnlineMembers members={onlineMembers} />
      </aside>
      <section className="flex flex-col flex-1">
        <MessageList
          messages={messages}
          loadMore={loadMore}
          hasMore={hasMore}
          userId={userId}
        />
        <ChatInput onSend={send} />
      </section>
    </div>
  );
}
