import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";
import { CreateMeetingUseCase } from "../../../../libs/application/use-cases/meeting/create-meeting.usecase";
import { PrismaMeetingRepository } from "../../../../libs/infrastructure/prisma/meeting.repository";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { UpdateMeetingUseCase } from "../../../../libs/application/use-cases/meeting/update-meeting.usecase";
import { DeleteMeetingUseCase } from "../../../../libs/application/use-cases/meeting/delete-meeting.usecase";
import { GetMeetingUseCase } from "../../../../libs/application/use-cases/meeting/get-meeting.usecase";



export const createMeetingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, subject, startTime, endTime } = req.body;
        const orgId = req.organization.id;

        if (!name || !orgId || !subject || !startTime || !endTime) throw new ValidationError(Messages.MISSING_FIELDS);

        const meetingRepo = new PrismaMeetingRepository();
        const useCase = new CreateMeetingUseCase(meetingRepo);
        const meeting = await useCase.execute({
            name,
            orgId,
            subject,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
        });

        res.status(HttpStatus.CREATED).json({ message: Messages.MEETING_CREATED, meeting });
    } catch (error) {
        next(error);
    }
};

export const updateMeetingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = req.params.id;
        const body = req.body;
        const orgId = req.organization.id;
        if (typeof idParam !== 'string') {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        //validate body
        if ((body && Object.entries(body).length === 0) || !body) {
            throw new ValidationError(Messages.MISSING_FIELDS);
        }

        const meetingRepo = new PrismaMeetingRepository();
        const useCase = new UpdateMeetingUseCase(meetingRepo);
        const meeting = await useCase.execute(idParam, orgId, body);

        res.status(HttpStatus.OK).json({ message: Messages.MEETING_UPDATED, meeting });
    } catch (error) {

    }
}


export const deleteMeetingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = req.params.id;
        const orgId = req.organization.id;
        const meetingRepo = new PrismaMeetingRepository();
        const useCase = new DeleteMeetingUseCase(meetingRepo);
        await useCase.execute({ id: idParam, orgId });
        res.status(HttpStatus.OK).json({ message: Messages.TASK_DELETED });
    } catch (err) {
        next(err);
    }
};

export const getAllMeetingsController = async (req: Request, res: Response, next: NextFunction) => {
   try {
            const { page = 1, limit = 10 ,...rawFilters} = req.query;
       const projectRepo = new PrismaMeetingRepository();
            const useCase = new GetMeetingUseCase(projectRepo);
            const result = await useCase.execute(
              rawFilters,
              Number(page),
              Number(limit)
            );
            res.status(HttpStatus.OK).json(result)
      
          } catch (err) {
            next(err);
          }
}

