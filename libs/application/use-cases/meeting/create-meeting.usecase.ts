import { Meeting } from "../../../domain/entities/meeting.entity";
import {  CreateMeetingDTO } from "../../../shared/types/src";
import { generateRoomId } from "../../../shared/utils/zegoCloudRoomIdGenerator";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";



export class CreateMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) {}

  async execute(data:CreateMeetingDTO) {
    const roomId = generateRoomId();
    const meeting = { ...data, roomId };
    const meetingDTO = await this.meetingRepo.create(meeting);
    const newMeeting = new Meeting(meetingDTO);
    return newMeeting.toDTO();
  }
}
