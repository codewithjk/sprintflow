
import { Meeting, MeetingProps } from "../../domain/entities/meeting.entity";
import { IMeetingRepository } from "../../application/interfaces/meeting-repository.interface";
import prisma from "./client";




export class PrismaMeetingRepository implements IMeetingRepository {
    async create(meeting: MeetingProps) {
        const newMeeting = await prisma.meeting.create({
            data: meeting,
        });
        return new Meeting(newMeeting)
    }

    async update(id: string, data: Partial<MeetingProps>): Promise<Meeting> {
        const meeting = await prisma.meeting.update({ where: { id }, data });
        return new Meeting(meeting);
    };
    async delete(id: string): Promise<void> {
        await prisma.meeting.delete({ where: { id } });
    };
    async findById(id: string): Promise<Meeting | null> {
        const meeting = await prisma.meeting.findUnique({ where: { id } });
        return meeting ? new Meeting(meeting) : null;
    }
    async find(filter: Partial<MeetingProps>, skip: number, take: number): Promise<{ meetings: Partial<Meeting>[]; total: number; page: number; pageSize: number; }> {
        const [meetings, total] = await Promise.all([
            prisma.meeting.findMany({
                where: filter,
                skip,
                take,
            }),
            prisma.meeting.count({
                where: filter,
            }),
        ]);

        return {
            meetings: meetings.map(meeting => new Meeting(meeting).toDTO()),
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
        };
    };
}
