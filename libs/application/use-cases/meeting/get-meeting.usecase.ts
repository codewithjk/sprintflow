import { MeetingProps } from "../../../domain/entities/meeting.entity";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";



export class GetMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) {}

  async execute(filter: Partial<MeetingProps>, skip :number,limit:number) {
    return await this.meetingRepo.find(filter , skip,limit);
  }
}
