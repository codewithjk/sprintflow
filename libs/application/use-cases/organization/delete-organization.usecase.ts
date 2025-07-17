import { Messages } from "../../../shared/constants/messages";
import {  NotFoundError } from "../../../shared/errors/app-error";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class DeleteOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
    private readonly userRepo: IUserRepository
  ) {}

    async execute({ id, ownerId }: { id: string; ownerId: string }) {
      const org = await this.orgRepo.findById(id);
      if (!org) {
        throw new NotFoundError(Messages.ORG_NOT_FOUND);
      }
      //todo : delete projects and tasks under that organization.
    await this.orgRepo.delete(id)
    await this.userRepo.update(ownerId,{orgId:null,role:"user"})
  }
}
