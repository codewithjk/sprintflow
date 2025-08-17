import { UserLoginUseCase, SignupUseCase, VerifyUserUseCase } from "../../../../libs/application/use-cases/auth";
import { LoadMessagesUseCase, SendMessageUseCase } from "../../../../libs/application/use-cases/chat";
import {
    CreateMeetingUseCase,
    DeleteMeetingUseCase,
    GetMeetingUseCase,
    UpdateMeetingUseCase
} from "../../../../libs/application/use-cases/meeting";
import { CreateOrganizationUseCase, DeleteOrganizationUseCase, GetAllOrganizationUseCase, GetInvitationUseCase, GetOrganizationUseCase, InviteUserUseCase, OrgLoginUseCase, SearchOrganizationsUseCase, UpdateOrganizationUseCase, VerifyOrganizationUseCase } from "../../../../libs/application/use-cases/organization";
import { CreateProjectUseCase, DeleteProjectUseCase, GetAllProjectsUseCase, GetProjectUseCase, SearchProjectsUseCase, UpdateProjectUseCase } from "../../../../libs/application/use-cases/project";
import { CreateTaskUseCase, DeleteTaskUseCase, GetAllTasksUseCase, GetTaskUseCase, SearchTaskUseCase, UpdateTaskUseCase } from "../../../../libs/application/use-cases/task";
import { GetAllUsersUseCase, GetUserByIdUseCase, UpdateUserUseCase } from "../../../../libs/application/use-cases/user";
import { HandleStripeWebhookUseCase } from "../../../../libs/application/use-cases/webhook";
import { BcryptPasswordService } from "../../../../libs/infrastructure/bcrypt";
import { EmailService } from "../../../../libs/infrastructure/email/email.service";
import { JwtService } from "../../../../libs/infrastructure/jwt/jwt.service";




import { PrismaChatRepository, PrismaMeetingRepository, PrismaOrganizationRepository, PrismaProjectRepository, PrismaTaskRepository, PrismaUserRepository } from "../../../../libs/infrastructure/prisma";
import { InvitationService, OtpService } from "../../../../libs/infrastructure/redis";
import { StripeService } from "../../../../libs/infrastructure/stripe/stripe.service";


import { environmentConfig } from "../config/environment.config";
import { emailTemplatePath } from "../config/path.config";


// services
export const stripeService = new StripeService();
export const otpService = new OtpService()
export const emailService = new EmailService(emailTemplatePath);
export const passwordService = new BcryptPasswordService();
export const jwtService = new JwtService(environmentConfig.JWT_TOKEN_SECRET);
export const invitationService = new InvitationService();


// repositories
export const meetingRepo = new PrismaMeetingRepository();
export const userRepo = new PrismaUserRepository();
export const orgRepo = new PrismaOrganizationRepository();
export const projectRepo = new PrismaProjectRepository();
export const taskRepo = new PrismaTaskRepository();
export const chatRepo = new PrismaChatRepository();

//  Meeting UseCases
export const createMeetingUseCase = new CreateMeetingUseCase(meetingRepo);
export const getMeetingUseCase = new GetMeetingUseCase(meetingRepo);
export const updateMeetingUseCase = new UpdateMeetingUseCase(meetingRepo);
export const deleteMeetingUseCase = new DeleteMeetingUseCase(meetingRepo);

// admin useCases
export const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
export const updateUserUseCase = new UpdateUserUseCase(userRepo);
export const getAllOrganizationsUseCase = new GetAllOrganizationUseCase(orgRepo);
export const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);


//auth useCases
export const signupUseCase = new SignupUseCase(userRepo, otpService, emailService);
export const verifyUserUseCase = new VerifyUserUseCase(userRepo, otpService, passwordService);
export const userLoginUseCase = new UserLoginUseCase(userRepo, passwordService, jwtService);


// -------------------
// use cases - organization
// -------------------
export const createOrganizationUseCase = new CreateOrganizationUseCase(orgRepo, otpService, emailService);
export const verifyOrganizationUseCase = new VerifyOrganizationUseCase(orgRepo, otpService, passwordService);
export const orgLoginUseCase = new OrgLoginUseCase(orgRepo, passwordService, jwtService);
export const updateOrganizationUseCase = new UpdateOrganizationUseCase(orgRepo);
export const deleteOrganizationUseCase = new DeleteOrganizationUseCase(orgRepo);
export const getOrganizationUseCase = new GetOrganizationUseCase(orgRepo);
export const searchOrganizationsUseCase = new SearchOrganizationsUseCase(orgRepo);
export const inviteUserUseCase = new InviteUserUseCase(userRepo, emailService, orgRepo, invitationService);
export const getInvitationUseCase = new GetInvitationUseCase(invitationService, orgRepo);


// -------------------
// use cases - Payment
// -------------------
export const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(stripeService, orgRepo);


//project use cases

export const createProjectUseCase = new CreateProjectUseCase(projectRepo);
export const updateProjectUseCase = new UpdateProjectUseCase(projectRepo);
export const deleteProjectUseCase = new DeleteProjectUseCase(projectRepo);
export const getProjectUseCase = new GetProjectUseCase(projectRepo);
export const getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepo);
export const searchProjectsUseCase = new SearchProjectsUseCase(projectRepo);


//task use case
export const createTaskUseCase = new CreateTaskUseCase(taskRepo);
export const getTaskUseCase = new GetTaskUseCase(taskRepo);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepo);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo);
export const searchTaskUseCase = new SearchTaskUseCase(taskRepo);
export const getAllTasksUseCase = new GetAllTasksUseCase(taskRepo);

//chat use case

 export const sendMessageUseCase = new SendMessageUseCase(chatRepo);
  export const loadMessagesUseCase = new LoadMessagesUseCase(chatRepo);
//   export const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);
//   export const getOrganizationUseCase = new GetOrganizationUseCase(orgRepo);