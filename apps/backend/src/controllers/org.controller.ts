import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { Messages } from "../../../../libs/shared/constants/messages";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { AppUserRole, CreateOrganizationDTO, UpdateOrganizationDTO, UpdateUserDTO } from "../../../../libs/shared/types/src";
import { setCookie } from "../utils/cookies/setCookie";
import { TokenType } from "../../../../libs/shared/constants/jwt-token-constants";
import { createOrganizationUseCase, deleteOrganizationUseCase, getAllUsersUseCase, getInvitationUseCase, getOrganizationUseCase, inviteUserUseCase, orgLoginUseCase, searchOrganizationsUseCase, updateOrganizationUseCase, updateUserUseCase, verifyOrganizationUseCase } from "../di";



export const createOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, } = req.body;
    if (!name || !email || !password) throw new ValidationError(Messages.MISSING_FIELDS);

    const role = AppUserRole.ORGANIZATION;
    const data: CreateOrganizationDTO = {
      name, email, password, role
    }
    await createOrganizationUseCase.execute(data);
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
    const data = await orgLoginUseCase.execute({ email, password }, AppUserRole.ORGANIZATION)

    setCookie(res,  data.refreshToken,AppUserRole.ORGANIZATION, TokenType.REFRESH_TOKEN);
    setCookie(res, data.accessToken, AppUserRole.ORGANIZATION, TokenType.ACCESS_TOKEN);
    
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
    const role = AppUserRole.ORGANIZATION;
    const data: CreateOrganizationDTO = { email, password, name, description, location, profileUrl, industry, phoneNumber, role };
    const newOrg = await verifyOrganizationUseCase.execute(data, otp)
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
    const data: UpdateOrganizationDTO = body;
    const id: string = idParam;
    const org = await updateOrganizationUseCase.execute({ id, data })
    res.status(HttpStatus.OK).json({ message: Messages.ORG_UPDATED, org })
  } catch (error) {
    next(error)
  }
}

export const updateMemberController = async (req: Request, res: Response, next: NextFunction) => {
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
    const data:UpdateUserDTO = body;
    const id: string = idParam;
    const user = await updateUserUseCase.execute({ id, data });
    res.status(HttpStatus.OK).json({ message: Messages.USER_UPDATED, user });
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
    await deleteOrganizationUseCase.execute({ id, ownerId });
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
    const org = await getOrganizationUseCase.execute(id);
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
    const result = await searchOrganizationsUseCase.execute({
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
  try {
    const { email, name } = req.body;
    if (!name || !email) throw new ValidationError(Messages.MISSING_FIELDS);

    const orgId = req.organization.id;
    const frontEndBaseURL = process.env.WEB_URL as string;

    await inviteUserUseCase.execute({ name, email, orgId, frontEndBaseURL });
    res.status(HttpStatus.OK).json({ message: Messages.INVITATION_SENT, });
  } catch (error) {
    next(error);
  }
}



export const acceptInvitationController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { token } = req.body;
    if (!token) throw new ValidationError(Messages.MISSING_FIELDS);

    const invitation = await getInvitationUseCase.execute(token);

    res.status(HttpStatus.OK).json({ message: Messages.ORG_JOIN_SUCCESS, invitation });
  } catch (error) {
    next(error);
  }
};


export const getAllMembersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, } = req.query;
    const orgId = req.organization.id;
    const filters = { orgId }
    const result = await getAllUsersUseCase.execute(
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

