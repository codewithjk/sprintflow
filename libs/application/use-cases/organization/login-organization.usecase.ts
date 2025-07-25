import { Messages } from "../../../shared/constants/messages";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../../../shared/constants/time-constants";
import { NotFoundError, UnauthorizedError } from "../../../shared/errors/app-error";
import { LoginDTO } from "../../../shared/types/src";
import { IJwtService } from "../../interfaces/jwt-service.interface";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IPasswordService } from "../../interfaces/password-service.interface";


export class OrgLoginUseCase {
    constructor(private readonly orgRepo: IOrganizationRepository,
        private readonly passwordService: IPasswordService,
        private readonly jwtService: IJwtService) { };
    
    async execute(data: LoginDTO,role:"organization") {
        const { email, password } = data;
        const org = await this.orgRepo.findByEmail(email);
        if (!org) throw new NotFoundError(Messages.ORG_NOT_FOUND);
      

        const isPasswordValid = await this.passwordService.compare(password, org.getPassword());
        if (!isPasswordValid) throw new UnauthorizedError(Messages.INVALID_PASSWORD);

        const accessToken = this.jwtService.sign({ email: org.email, id: org.id, role},ACCESS_TOKEN_EXPIRATION);
        const refreshToken = this.jwtService.sign({ email: org.email, id: org.id, role}, REFRESH_TOKEN_EXPIRATION);
        return {
            accessToken,
            refreshToken,
            org:org.toDTO(),
        }
    }
}