import { NextFunction, Request, Response } from "express";
import { CreateOrganizationUseCase } from "../../../../libs/application/use-cases/organization/create-organization.usecase";
import { PrismaOrganizationRepository } from "../../../../libs/infrastructure/prisma/org.repository";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { Messages } from "../../../../libs/shared/constants/messages";
import { DeleteOrganizationUseCase } from "../../../../libs/application/use-cases/organization/delete-organization.usecase";
import { GetOrganizationUseCase } from "../../../../libs/application/use-cases/organization/get-organization.usecase";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Organization } from "../../../../libs/domain/entities/organization.entity";
import { UpdateOrganizationUseCase } from "../../../../libs/application/use-cases/organization/update-organization.usecase";
import { SearchOrganizationsUseCase } from "../../../../libs/application/use-cases/organization/search-organizations.usecase";
import { CreateOrganizationDTO } from "../../../../libs/shared/types/src";
import { OtpService } from "../../../../libs/infrastructure/redis/otp.service";
import path from "path";
import { EmailService } from "../../../../libs/infrastructure/email/email.service";
import { BcryptPasswordService } from "../../../../libs/infrastructure/bcrypt";
import { VerifyOrganizationUseCase } from "../../../../libs/application/use-cases/organization/verify-organization.usecase";
import { JwtService } from "../../../../libs/infrastructure/jwt/jwt.service";
import { setCookie } from "../utils/cookies/setCookie";
import { JWT_TOKEN_SECRET } from "../../../../libs/shared/constants/env-constants";
import { OrgLoginUseCase } from "../../../../libs/application/use-cases/organization/login-organization.usecase";
import { InviteUserUseCase } from "../../../../libs/application/use-cases/organization/invite-user.usecase";
import { InvitationService } from "../../../../libs/infrastructure/redis/invitation.service";
import { GetInvitationUseCase } from "../../../../libs/application/use-cases/organization/get-invitation.usecase";
import { GetAllUsersUseCase } from "../../../../libs/application/use-cases/user/get-all-projects.usecase";



export const createOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, } = req.body;
    if (!name || !email || !password) throw new ValidationError(Messages.MISSING_FIELDS);

    const role = "organization";
    const data: CreateOrganizationDTO = {
      name, email, password, role
    }
    const otpService = new OtpService()
    const templatePath = path.join(process.cwd(), 'apps', 'backend', 'src', 'utils', 'email-templates');
    const emailService = new EmailService(templatePath)
    const orgRepo = new PrismaOrganizationRepository();

    const useCase = new CreateOrganizationUseCase(orgRepo, otpService, emailService);
    await useCase.execute(data);
    res.status(HttpStatus.OK).json({ message: Messages.OTP_SENT, });
  } catch (error) {
    next(error);
  }
};

export const loginOrgController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError(Messages.EMAIL_AND_PASSWORD_REQUIRED));
    }
    const orgRepository = new PrismaOrganizationRepository();
    const passwordService = new BcryptPasswordService()
    const jwtService = new JwtService(JWT_TOKEN_SECRET)

    const useCase = new OrgLoginUseCase(orgRepository, passwordService, jwtService);
    const data = await useCase.execute({ email, password }, "organization")

    setCookie(res, "refresh_token", data.refreshToken);
    setCookie(res, "access_token", data.accessToken);
    console.log(data)
    res.status(HttpStatus.OK).json({
      message: Messages.LOGIN_SUCCESS,
      org: data.org,
      status: "success"
    });
  } catch (error) {
    next(error);
  }
}

export const verifyOrgController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, name, description, location, profileUrl, industry, phoneNumber } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Missing required fields!"));
    }
    const role = "organization";
    const data: CreateOrganizationDTO = { email, password, name, description, location, profileUrl, industry, phoneNumber, role }
    const orgRepo = new PrismaOrganizationRepository();
    const otpService = new OtpService()
    const passwordService = new BcryptPasswordService()
    const useCase = new VerifyOrganizationUseCase(orgRepo, otpService, passwordService)
    const newOrg = await useCase.execute(data, otp)
    res.status(HttpStatus.CREATED).json({
      message: Messages.ORG_VERIFIED,
      org: newOrg,
      status: "success"
    });

  } catch (error) {
    next(error);
  }
}

export const updateOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = req.params.id;
    const body = req.body;
    if (typeof idParam !== 'string') {
      throw new ValidationError(Messages.INVALID_PARAMS);
    }
    //validate body
    if ((body && Object.entries(body).length === 0) || !body) {
      throw new ValidationError(Messages.MISSING_FIELDS);
    }
    const data: Partial<Organization> = body;
    const id: string = idParam;
    const orgRepo = new PrismaOrganizationRepository();
    const useCase = new UpdateOrganizationUseCase(orgRepo);
    const org = await useCase.execute({ id, data })
    res.status(HttpStatus.OK).json({ message: Messages.ORG_UPDATED, org })
  } catch (error) {
    next(error)
  }
}

export const deleteOrganizationController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const idParam = req.params.id;
    if (typeof idParam !== 'string') {
      throw new ValidationError(Messages.INVALID_PARAMS);
    }
    const id: string = idParam;
    const ownerId = req.user.id;
    const orgRepo = new PrismaOrganizationRepository();
    const useCase = new DeleteOrganizationUseCase(orgRepo);
    await useCase.execute({ id, ownerId });
    res.status(HttpStatus.OK).json({ message: Messages.ORG_DELETED })
  } catch (error) {
    next(error)
  }
}

export const getOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = req.params.id;
    if (typeof idParam !== 'string') {
      throw new ValidationError(Messages.INVALID_PARAMS);
    }
    const id: string = idParam;
    const orgRepo = new PrismaOrganizationRepository();
    const useCase = new GetOrganizationUseCase(orgRepo);
    const org = await useCase.execute(id);
    res.status(HttpStatus.OK).json({ message: Messages.ORG_FOUND, org })
  } catch (error) {
    next(error)
  }
}

export const searchOrganizationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    if (!search) {
      throw new ValidationError(Messages.INVALID_PARAMS);
    }

    const orgRepo = new PrismaOrganizationRepository();
    const useCase = new SearchOrganizationsUseCase(orgRepo);

    const result = await useCase.execute({
      search: String(search),
      page: Number(page),
      limit: Number(limit),
    });

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
};


export const inviteUserToOrgController = async (req: Request, res: Response, next: NextFunction) => {
  //todo
  try {
    const { email, name } = req.body;
    if (!name || !email) throw new ValidationError(Messages.MISSING_FIELDS);

    const orgId = req.organization.id;
    const templatePath = path.join(process.cwd(), 'apps', 'backend', 'src', 'utils', 'email-templates');
    const emailService = new EmailService(templatePath)
    const orgRepo = new PrismaOrganizationRepository();
    const userRepo = new PrismaUserRepository();
    const invitationService = new InvitationService()

    const frontEndBaseURL = process.env.WEB_URL as string;
    const useCase = new InviteUserUseCase(userRepo, emailService, orgRepo, invitationService);
    await useCase.execute({ name, email, orgId, frontEndBaseURL });
    res.status(HttpStatus.OK).json({ message: Messages.INVITATION_SENT, });
  } catch (error) {
    next(error);
  }
}



export const acceptInvitationController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { token } = req.body;
    if (!token) throw new ValidationError(Messages.MISSING_FIELDS);
    const invitationService = new InvitationService();
    const orgRepo = new PrismaOrganizationRepository();
    const useCase = new GetInvitationUseCase(invitationService, orgRepo);
    const invitation = await useCase.execute(token);


    res.status(200).json({ message: Messages.ORG_JOIN_SUCCESS, invitation });
  } catch (error) {
    next(error);
  }
};


export const getAllMembersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, } = req.query;
    const orgId = req.organization.id;
    const filters = { orgId }
    const userRepo = new PrismaUserRepository();
    const useCase = new GetAllUsersUseCase(userRepo);
    const result = await useCase.execute(
      filters,
      Number(page),
      Number(limit)
    );
    const { users: members, ...rest } = result;
    res.status(HttpStatus.OK).json({ members, ...rest });

  } catch (err) {
    next(err);
  }
}

