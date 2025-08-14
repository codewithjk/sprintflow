
import { UserStatus } from '../../../domain/enums/user.enums';
import { Messages } from '../../../shared/constants/messages';
import { ConflictError } from '../../../shared/errors/app-error';
import {  VerificationDTO } from '../../../shared/types/src';

import { IOtpService } from '../../interfaces/otp-service.interface';
import { IPasswordService } from '../../interfaces/password-service.interface';
import { IUserRepository } from '../../interfaces/user-repository.interface';



export class VerifyUserUseCase {
    constructor(private readonly userRepo: IUserRepository,
        private readonly otpService: IOtpService,
        private readonly passwordService: IPasswordService
    ) { }

    async execute(data: VerificationDTO) {

        const existing = await this.userRepo.findByEmail(data.email);
        if (existing) throw new ConflictError(Messages.USER_ALREADY_EXISTS);
        await this.otpService.verifyOtp(data.email, data.otp);
        const hash = await this.passwordService.hash(data.password);
        const user = await this.userRepo.create({
            name: data.name,
            email: data.email,
            password: hash,
            isVerified: true,
            isOwner: false,
            role: 'user',
            orgId: data.orgId,
            status:UserStatus.ACTIVE,
        });
        return user.toDTO();
    }
}
