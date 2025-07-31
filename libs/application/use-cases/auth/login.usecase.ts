import { Messages } from "../../../shared/constants/messages";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "../../../shared/constants/time-constants";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../../shared/errors/app-error";
import { LoginDTO } from "../../../shared/types/src";
import { IJwtService } from "../../interfaces/jwt-service.interface";
import { IPasswordService } from "../../interfaces/password-service.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";



export class LoginUseCase {
    constructor(private readonly userRepo: IUserRepository,
        private readonly passwordService: IPasswordService,
        private readonly jwtService: IJwtService) { };
    
    async execute(data: LoginDTO,role:"user" |"super_admin") {
        const { email, password } = data;
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new NotFoundError(Messages.USER_NOT_FOUND);
        const authProvider = user.getAuthProvider();
        // throw error for Oauth users
        if (authProvider && authProvider !== "local") throw new UnauthorizedError(Messages.OAUTH_USER_CANNOT_LOGIN_WITH_PASSWORD);
        const isPasswordValid = await this.passwordService.compare(password, user.getPassword());
        if (!isPasswordValid) throw new ValidationError(Messages.INVALID_PASSWORD);

        const accessToken = this.jwtService.sign({ email: user.email, id: user.id, role},ACCESS_TOKEN_EXPIRATION);
        const refreshToken = this.jwtService.sign({ email: user.email, id: user.id, role}, REFRESH_TOKEN_EXPIRATION);
        return {
            accessToken,
            refreshToken,
            user:user.toDTO(),
        }
    }
}