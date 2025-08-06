import { Chat, ChatProps } from "../../domain/entities/chat.entity";
import { CreateChatDTO } from "../../shared/types/src";

export interface IChatRepository {
  create(msg: CreateChatDTO): Promise<Chat>;
  loadRecent(orgId: string, limit: number): Promise<ChatProps[]>;
  loadBefore(orgId: string, before: Date, limit: number): Promise<ChatProps[]>;
    // find(filter : Partial<ChatProps>, skip: number, take: number) : Promise<{ chats: Partial<Chat>[]; total: number; page: number; pageSize: number; }>;
}
