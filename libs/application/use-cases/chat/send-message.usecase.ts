import { Chat } from "../../../domain/entities/chat.entity";
import { CreateChatDTO } from "../../../shared/types/src";
import { IChatRepository } from "../../interfaces/chat-repository.interface";

export class SendMessageUseCase {
  constructor(private repo: IChatRepository) {}
  async execute(data: CreateChatDTO) {
    const chatDTO = await this.repo.create(data);
    const chat = new Chat(chatDTO);
    return chat.toDTO();
  }
}
