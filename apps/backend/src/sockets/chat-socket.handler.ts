import { Server, Socket } from "socket.io";
import { SendMessageUseCase } from "../../../../libs/application/use-cases/chat/send-message.usecase";
import { LoadMessagesUseCase } from "../../../../libs/application/use-cases/chat/load-message.usecase";
import { OnlineUsersService } from "../../../../libs/infrastructure/redis/online-user.service";
import { NotFoundError } from "../../../../libs/shared/errors/app-error";
import { GetUserByIdUseCase } from "../../../../libs/application/use-cases/user/get-user-by-id.usecase";
import { GetOrganizationUseCase } from "../../../../libs/application/use-cases/organization/get-organization.usecase";
import { getOrganizationUseCase, getUserByIdUseCase, loadMessagesUseCase, sendMessageUseCase } from "../di";



export class ChatSocketHandler {
    constructor(private io: Server) {
        this.io.on("connection", (socket: Socket) => this.handleConnection(socket, loadMessagesUseCase, sendMessageUseCase, getUserByIdUseCase, getOrganizationUseCase));
    }

    private async handleConnection(
        socket: Socket,
        loadUC: LoadMessagesUseCase,
        sendUC: SendMessageUseCase,
        getUserUC: GetUserByIdUseCase,
        getOrgUC: GetOrganizationUseCase,
    ) {
        const { orgId, userId, role } = socket.handshake.auth;
        const onlineUserService = new OnlineUsersService()

        if (!orgId || !userId || !role) {
            socket.disconnect();
            return;
        }

        try {
            let user;
            if (role === "organization") {
                user = await getOrgUC.execute(orgId);
            } else if (role === "user") {
                user = await getUserUC.execute(userId);
            }
            if (!user) throw new NotFoundError("User not found");

            const redisKey = `online:${orgId}`;
            await onlineUserService.addUser(redisKey, userId, user);
            socket.join(`org-${orgId}`);

            // emit user joined
            this.io.to(`org-${orgId}`).emit("chat:memberJoined", user);

            //emit initial chat
            const recent = await loadUC.loadRecent(orgId);
            socket.emit("chat:init", recent.reverse());

            // emit current online users
            const onlineUsersRaw = await onlineUserService.getOnlineUsers(redisKey)
            const onlineUsers = onlineUsersRaw.map((u) => JSON.parse(u));
            socket.emit("chat:online", onlineUsers);

            // load older
            socket.on("chat:loadMore", async ({ before }) => {
                const older = await loadUC.loadBefore(orgId, new Date(before), 20);
                socket.emit("chat:older", older.reverse());
            });

            // send message
            socket.on("chat:send", async ({ content }) => {
                const msg = await sendUC.execute({
                    orgId,
                    userId,
                    content,
                    createdAt: new Date(),
                });
                this.io.to(`org-${orgId}`).emit("chat:message", msg);
            });

            //disconnect
            socket.on("disconnect", async () => {
                await onlineUserService.removeUser(redisKey, userId);
                this.io.to(`org-${orgId}`).emit("chat:memberLeft", { userId });
            });

        } catch (error) {
            console.error("Socket error:", error);
            socket.emit("chat:error", "Failed to join chat");
            socket.disconnect();
        }




    }
}
