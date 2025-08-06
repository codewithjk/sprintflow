import { Meeting, MeetingProps } from "../../domain/entities/meeting.entity";
import { CreateMeetingDTO } from "../../shared/types/src";

export interface IMeetingRepository {
  create(data :CreateMeetingDTO ): Promise<Meeting>;
  update(id: string, data: Partial<MeetingProps>): Promise<Meeting>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Meeting | null>;
  find(filter : Partial<MeetingProps>, skip: number, take: number) : Promise<{ meetings: Partial<Meeting>[]; total: number; page: number; pageSize: number; }>;
}
