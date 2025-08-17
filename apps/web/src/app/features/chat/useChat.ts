import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../auth/useAuth";
import { UserProps } from "../../../../../../libs/domain/entities/user.entity";
import { OrgProps } from "../../../../../../libs/domain/entities/organization.entity";

export interface ChatMessage {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
}

export function useChat(orgId: string, userId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [onlineMembers, setOnlineMembers] = useState<UserProps[] | OrgProps[]>([]);
    const socketRef = useRef<Socket>(null);
    const {user} = useAuth()

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL!, {
            withCredentials: true,
            auth: { orgId, userId, role:user?.role },
        });
        socketRef.current = socket;

        socket.on("chat:init", (msgs: ChatMessage[]) => {
            setMessages(msgs)
        });
        socket.on("chat:message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg])
        });
        socket.on("chat:older", (more: ChatMessage[]) => {
            if (more.length < 20) setHasMore(false);
            setMessages((prev) => [...more, ...prev]);
        });

        socket.on("chat:online", (users) => {
            setOnlineMembers(users);
        });

        // track joining/leaving
        socket.on("chat:memberJoined", ({ userId: id }: { userId: string }) => {
            setOnlineMembers((prev) => [...new Set([...prev, id])]);
        });
        socket.on("chat:memberLeft", ({ userId: id }: { userId: string }) => {
            setOnlineMembers((prev) => prev.filter((u) => u !== id));
        });

        return () => socket.disconnect();
    }, [orgId, userId]);

    const send = (content: string) => {
        return socketRef.current?.emit("chat:send", { content });
    }

    const loadMore = () => {
        console.log("loadMore is triggering")
        const before = messages[0]?.createdAt;
        if (before) socketRef.current?.emit("chat:loadMore", { before });
    };

    return { messages, send, loadMore, hasMore, onlineMembers };
}
