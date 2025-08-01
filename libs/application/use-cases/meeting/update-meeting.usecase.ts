import { MeetingProps } from "../../../domain/entities/meeting.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError } from "../../../shared/errors/app-error";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";



export class UpdateMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) { }

  async execute(id: string, orgId: string, data: MeetingProps) {
    const meeting = await this.meetingRepo.findById(id);
    if (!meeting?.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
    return (await this.meetingRepo.update(id, data)).toDTO();
  }
}
