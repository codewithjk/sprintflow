import { Meeting } from "../../../domain/entities/meeting.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";

export class DeleteMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) { }

  async execute({ id,orgId}:{id: string,orgId:string}) {
    const meetingDTO = await this.meetingRepo.findById(id);
    if (!meetingDTO) {
      throw new NotFoundError(Messages.MEETING_NOT_FOUND);
    }
    const meeting = new Meeting(meetingDTO);
     if (!meeting?.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
    await this.meetingRepo.delete(id);
  }
}
