import { MeetingDTO } from "../../../shared/types/src";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";

export class GetMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) {}

  async execute(filter: Partial<MeetingDTO>, skip :number,limit:number) {
    return await this.meetingRepo.find(filter , skip,limit);
  }
}
