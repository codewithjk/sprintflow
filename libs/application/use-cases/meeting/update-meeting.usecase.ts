import { Meeting } from "../../../domain/entities/meeting.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError } from "../../../shared/errors/app-error";
import { UpdateMeetingDTO } from "../../../shared/types/src";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";
export class UpdateMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) { }

  async execute(id: string, orgId: string, data: UpdateMeetingDTO) {

    //Check the existence of meeting and authorization.
    const meetingDTO = await this.meetingRepo.findById(id);
    if (!meetingDTO) throw new ForbiddenError(Messages.MEETING_NOT_FOUND);
    const meeting = new Meeting(meetingDTO);
    if (!meeting?.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);

    // Update 
    const updatedMeetingDTO = await this.meetingRepo.update(id, data);
    const updatedMeeting = new Meeting(updatedMeetingDTO);
    return updatedMeeting.toDTO();
  }
}
