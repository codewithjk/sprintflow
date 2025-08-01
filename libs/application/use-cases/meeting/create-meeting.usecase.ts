import { CreateMeetingDTO } from "../../../shared/types/src";
import { generateRoomId } from "../../../shared/utils/zegoCloudRoomIdGenerator";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";



export class CreateMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) {}

  async execute(data: CreateMeetingDTO) {
    const roomId = generateRoomId();
      const meeting = { ...data, roomId };
    return (await this.meetingRepo.create(meeting)).toDTO();
  }
}
