import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError } from "../../../shared/errors/app-error";
import { IMeetingRepository } from "../../interfaces/meeting-repository.interface";

export class DeleteMeetingUseCase {
  constructor(
    private meetingRepo: IMeetingRepository,
  ) { }

  async execute({ id,orgId}:{id: string,orgId:string}) {
    const meeting = await this.meetingRepo.findById(id);
     if (!meeting?.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
    await this.meetingRepo.delete(id);
  }
}
