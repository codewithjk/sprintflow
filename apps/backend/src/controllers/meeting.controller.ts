import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { createMeetingUseCase, deleteMeetingUseCase, getMeetingUseCase, updateMeetingUseCase } from "../di";


export const createMeetingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, subject, startTime, endTime } = req.body;
        const orgId = req.organization.id;

        if (!name || !orgId || !subject || !startTime || !endTime) throw new ValidationError(Messages.MISSING_FIELDS);

        const meeting = await createMeetingUseCase.execute({
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

        const meeting = await updateMeetingUseCase.execute(idParam, orgId, body);

        res.status(HttpStatus.OK).json({ message: Messages.MEETING_UPDATED, meeting });
    } catch (error) {
        next(error)
    }
}

export const deleteMeetingController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = req.params.id;
        const orgId = req.organization.id;
        await deleteMeetingUseCase.execute({ id: idParam, orgId });
        res.status(HttpStatus.OK).json({ message: Messages.TASK_DELETED });
    } catch (err) {
        next(err);
    }
};

export const getAllMeetingsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, ...rawFilters } = req.query;
        const result = await getMeetingUseCase.execute(
            rawFilters,
            Number(page),
            Number(limit)
        );
        res.status(HttpStatus.OK).json(result)

    } catch (err) {
        next(err);
    }
}

