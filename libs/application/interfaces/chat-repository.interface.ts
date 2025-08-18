import { ChatDTO, CreateChatDTO } from "../../shared/types/src";

export interface IChatRepository {
  create(msg: CreateChatDTO): Promise<ChatDTO>;
  loadRecent(orgId: string, limit: number): Promise<ChatDTO[]>;
  loadBefore(orgId: string, before: Date, limit: number): Promise<ChatDTO[]>;
}
