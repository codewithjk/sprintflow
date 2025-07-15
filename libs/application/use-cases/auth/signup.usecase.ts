
import { Messages } from '../../../shared/constants/messages';
import { ConflictError } from '../../../shared/errors/app-error';
import { SignupDTO } from '../../../shared/types/src';
import { IEmailService } from '../../interfaces/email-service.interface';
import { IOtpService } from '../../interfaces/otp-service.interface';
import { IUserRepository } from '../../interfaces/user-repository.interface';



export class SignupUseCase {
  constructor(private readonly userRepo: IUserRepository,
    private readonly otpService: IOtpService,
    private readonly emailService: IEmailService) { }

  async execute(data: SignupDTO) {

    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError(Messages.USER_ALREADY_EXISTS);

    await this.otpService.checkRestrictions(data.email);
    await this.otpService.trackRequest(data.email);

    const otp = await this.otpService.generateAndStoreOtp(data.email);
    await this.emailService.sendEmail(data.email, "Verify Your Email", "user-activation-email", { otp, name: data.name })
  }
}
