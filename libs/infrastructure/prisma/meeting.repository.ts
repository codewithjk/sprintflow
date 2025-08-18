import { IMeetingRepository } from "../../application/interfaces/meeting-repository.interface";
import prisma from "./client";
import { CreateMeetingDTO, MeetingDTO, UpdateMeetingDTO } from "../../shared/types/src";

export class PrismaMeetingRepository implements IMeetingRepository {
    async create(meeting: CreateMeetingDTO & { roomId: string }) {
        const newMeeting = await prisma.meeting.create({
            data: meeting,
        });
        return newMeeting;
    }
    async update(id: string, data: UpdateMeetingDTO): Promise<MeetingDTO> {
        const meeting = await prisma.meeting.update({ where: { id }, data });
        return meeting;
    };
    async delete(id: string): Promise<void> {
        await prisma.meeting.delete({ where: { id } });
    };
    async findById(id: string): Promise<MeetingDTO | null> {
        const meeting = await prisma.meeting.findUnique({ where: { id } });
        return meeting ? meeting : null;
    }
    async find(filter: Partial<MeetingDTO>, skip: number, take: number): Promise<{ meetings: MeetingDTO[]; total: number; page: number; pageSize: number; }> {
        const [meetings, total] = await Promise.all([
            prisma.meeting.findMany({
                where: filter,
                     orderBy: {
                createdAt: 'desc', // 🆕 ensure latest meetings come first
            },
                skip,
                take,
            
            }),
            prisma.meeting.count({
                where: filter,
            }),
        ]);

        return {
            meetings,
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
        };
    };
}
