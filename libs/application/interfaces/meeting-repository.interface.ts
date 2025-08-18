import { CreateMeetingDTO, MeetingDTO, UpdateMeetingDTO } from "../../shared/types/src";

export interface IMeetingRepository {
  create(data :CreateMeetingDTO ): Promise<MeetingDTO>;
  update(id: string, data: UpdateMeetingDTO): Promise<MeetingDTO>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<MeetingDTO | null>;
  find(filter : Partial<MeetingDTO>, skip: number, take: number) : Promise<{ meetings: Partial<MeetingDTO>[]; total: number; page: number; pageSize: number; }>;
}
