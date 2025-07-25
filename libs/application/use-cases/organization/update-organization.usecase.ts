import { Organization } from "../../../domain/entities/organization.entity";
import { Messages } from "../../../shared/constants/messages";
import {  NotFoundError } from "../../../shared/errors/app-error";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";


export class UpdateOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
  ) {}

    async execute({ id, data }: { id: string; data :Partial<Organization>}) {
      const org = await this.orgRepo.findById(id);
      if (!org) {
        throw new NotFoundError(Messages.ORG_NOT_FOUND);
      }
      //check if requested user is the owner of the organization
     
      //todo : if any changes to be made to projects and tasks under that organization, do here.
        const updatedOrg = await this.orgRepo.update(id, data);
        return updatedOrg.toDTO();
  }
}
