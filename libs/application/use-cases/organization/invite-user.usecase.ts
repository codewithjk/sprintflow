import { inviteEmailProps } from "../../../shared/types/src";
import { IEmailService } from "../../interfaces/email-service.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class InviteUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute({ email, orgId,inviteMailData ,templateName }: { email: string; orgId: string , inviteMailData:inviteEmailProps,templateName :string }) {
    const user = await this.userRepo.findByEmail(email);
    if (user && user.orgId) {
      throw new Error("User already belongs to another organization");
    }
    const token = await this.emailService.sendEmail(email, "Invitation mail", templateName, inviteMailData);
    return { message: 'Invitation sent', token };
  }
}
