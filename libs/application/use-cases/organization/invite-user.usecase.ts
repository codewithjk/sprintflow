
import { IEmailService } from "../../interfaces/email-service.interface";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";
import { IInvitationService } from "../../interfaces/invitation-service.interface";
import { ConflictError } from "../../../shared/errors/app-error";

export class InviteUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService,
    private readonly orgRepo: IOrganizationRepository,
    private readonly invitationService:IInvitationService,
  ) {}

  async execute({name,email, orgId ,frontEndBaseURL}: {name:string, email: string; orgId: string , frontEndBaseURL:string }) {
    const user = await this.userRepo.findByEmail(email);
    if (user && user.orgId) {
      throw new ConflictError("User already belongs to another organization");
    }
    const organization = await this.orgRepo.findById(orgId);

    const token = await this.invitationService.createInvitation({ email, orgId });
    // convert token ito url
    const url = `${frontEndBaseURL}/invite/${token}`
    const inviteMailData = {
      name,
      url,
      orgName: organization?.name
    }
     await this.emailService.sendEmail(email, "Invitation mail", "invite-user-email", inviteMailData);
    return { message: 'Invitation sent',  };
  }
}
