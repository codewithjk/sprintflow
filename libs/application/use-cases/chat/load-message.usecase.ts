import { IChatRepository } from "../../interfaces/chat-repository.interface";

export class LoadMessagesUseCase {
  constructor(private repo: IChatRepository){}
  async loadRecent(orgId: string, limit = 20) { return this.repo.loadRecent(orgId, limit); }
  async loadBefore(orgId: string, before: Date, limit = 20) { return this.repo.loadBefore(orgId, before, limit); }
}
