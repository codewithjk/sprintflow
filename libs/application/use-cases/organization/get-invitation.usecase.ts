
import { Messages } from "../../../shared/constants/messages";
import { ValidationError } from "../../../shared/errors/app-error";
import { InvitationData } from "../../../shared/types/src";
import { IInvitationService } from "../../interfaces/invitation-service.interface";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";




export class GetInvitationUseCase {
    constructor(
        private readonly invitationService: IInvitationService,
        private readonly orgRepo:IOrganizationRepository,
    ) { };

    async execute(token: string):Promise<InvitationData |null> {
        const invite = await this.invitationService.getInvitation(token);

        if (!invite) {
            throw new ValidationError(Messages.INVITATION_EXPIRED);
        }

        if (invite.status === "used") {
            throw new ValidationError(Messages.INVITATION_ALREADY_USED);
        }
        await this.invitationService.markUsed(token);
        await this.invitationService.removeInvitation(token);
        const orgId = invite.orgId;
        this.orgRepo.findById(orgId);
        return invite;
    }
}