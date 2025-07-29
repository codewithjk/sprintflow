import { Messages } from "../../../shared/constants/messages";
import {  NotFoundError } from "../../../shared/errors/app-error";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";

export class DeleteOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
  ) {}

    async execute({ id, ownerId }: { id: string; ownerId: string }) {
      const org = await this.orgRepo.findById(id);
      if (!org) {
        throw new NotFoundError(Messages.ORG_NOT_FOUND);
      }
      //todo : delete projects, members and tasks under that organization.
      await this.orgRepo.delete(id);
  }
}
