
import { Messages } from '../../../shared/constants/messages';
import { ConflictError } from '../../../shared/errors/app-error';
import {  CreateOrganizationDTO,  } from '../../../shared/types/src';
import { IOrganizationRepository } from '../../interfaces/org-repository.interface';

import { IOtpService } from '../../interfaces/otp-service.interface';
import { IPasswordService } from '../../interfaces/password-service.interface';





export class VerifyOrganizationUseCase {
    constructor(private readonly orgRepo: IOrganizationRepository,
        private readonly otpService: IOtpService,
        private readonly passwordService: IPasswordService
    ) { }

    async execute(data: CreateOrganizationDTO,otp:string) {

        const existing = await this.orgRepo.findByName(data.name);
        if (existing) throw new ConflictError(Messages.ORG_ALREADY_EXISTS);
        await this.otpService.verifyOtp(data.email, otp);
        const hash = await this.passwordService.hash(data.password);
        const org = await this.orgRepo.create({
           ...data,password : hash
        });
        return org.toDTO();
    }
}
