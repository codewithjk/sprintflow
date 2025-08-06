import { CreateChatDTO } from "../../../shared/types/src";
import { IChatRepository } from "../../interfaces/chat-repository.interface";

export class SendMessageUseCase {
  constructor(private repo: IChatRepository) {}
  async execute(data: CreateChatDTO) { return (await this.repo.create(data)).toDTO(); }
}
