import { IChatRepository } from "../../application/interfaces/chat-repository.interface";
import { CreateChatDTO } from "../../shared/types/src";
import prisma from "./client";

export class PrismaChatRepository implements IChatRepository {
  async create(msg: CreateChatDTO) {
    const newChat = await prisma.chat.create({ data: msg, include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          profileUrl: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
          email: true,
          profileUrl: true,
        },
      },
    },});
    return newChat;
  }
  async loadRecent(orgId: string, limit: number) {
    return prisma.chat.findMany({
      where: { orgId }, orderBy: { createdAt: "desc" }, take: limit, include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true,
          }
        },
      }
    });
  }

  async loadBefore(orgId: string, before: Date, limit: number) {
    return prisma.chat.findMany({
      where: { orgId, createdAt: { lt: before } },
      orderBy: { createdAt: "desc" }, take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true,
          }
        }
      }
    });
  }
}
