import { MeetingDTO } from "../../../shared/types/src";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";

export class GetMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) {}

  async execute(filter: Partial<MeetingDTO>, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.meetingRepo.find(filter , skip,limit);
  }
}
