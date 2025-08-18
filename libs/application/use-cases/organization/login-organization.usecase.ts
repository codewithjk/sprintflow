import { Messages } from "../../../shared/constants/messages";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../../../shared/constants/jwt-token-constants";
import { NotFoundError, ValidationError } from "../../../shared/errors/app-error";
import { AppUserRole, LoginDTO } from "../../../shared/types/src";
import { IJwtService } from "../../interfaces/jwt-service.interface";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IPasswordService } from "../../interfaces/password-service.interface";
import { Organization } from "../../../domain/entities/organization.entity";



export class OrgLoginUseCase {
    constructor(private readonly orgRepo: IOrganizationRepository,
        private readonly passwordService: IPasswordService,
        private readonly jwtService: IJwtService) { };
    
    async execute(data: LoginDTO,role:AppUserRole.ORGANIZATION) {
        const { email, password } = data;
        const orgDTO = await this.orgRepo.findByEmail(email);
        if (!orgDTO) throw new NotFoundError(Messages.ORG_NOT_FOUND);
        const org = new Organization(orgDTO);
      
        

        const isPasswordValid = await this.passwordService.compare(password, org.getPassword());
        if (!isPasswordValid) throw new ValidationError(Messages.INVALID_PASSWORD);

        const accessToken = this.jwtService.sign({ email: org.email, id: org.id, role},ACCESS_TOKEN_EXPIRATION);
        const refreshToken = this.jwtService.sign({ email: org.email, id: org.id, role}, REFRESH_TOKEN_EXPIRATION);
        return {
            accessToken,
            refreshToken,
            org:org.toDTO(),
        }
    }
}