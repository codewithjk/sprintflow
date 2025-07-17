
import { Messages } from "../../../shared/constants/messages";
import { ConflictError } from "../../../shared/errors/app-error";
import { IEmailService } from "../../interfaces/email-service.interface";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IOtpService } from "../../interfaces/otp-service.interface";

export class CreateOrganizationUseCase {
  // constructor(
  //   private readonly orgRepo: IOrganizationRepository,
  // ) {}

  // async execute(data : CreateOrganizationDTO) {
  //   const org = await this.orgRepo.create(data);
  //   return org.toDTO();
    
  // }
  constructor(private readonly orgRepo: IOrganizationRepository,
      private readonly otpService: IOtpService,
      private readonly emailService: IEmailService) { }
  
    async execute(data: {name :string ,email : string}) {
  
      const existing = await this.orgRepo.findByName(data.name);
      if (existing) throw new ConflictError(Messages.ORG_ALREADY_EXISTS);
  
      await this.otpService.checkRestrictions(data.email);
      await this.otpService.trackRequest(data.email);
  
      const otp = await this.otpService.generateAndStoreOtp(data.email);
      await this.emailService.sendEmail(data.email, "Verify Your Email", "org-activation-email", { otp, name: data.name })
    }
}
