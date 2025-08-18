
import { Organization } from "../../../domain/entities/organization.entity";
import { Messages } from "../../../shared/constants/messages";
import {  NotFoundError } from "../../../shared/errors/app-error";
import { UpdateOrganizationDTO } from "../../../shared/types/src";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";


export class UpdateOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
  ) {}

    async execute({ id, data }: { id: string; data :UpdateOrganizationDTO}) {
      const org = await this.orgRepo.findById(id);
      if (!org) {
        throw new NotFoundError(Messages.ORG_NOT_FOUND);
      }     
      const OrgDTO = await this.orgRepo.update(id, data);
      const updatedOrg = new Organization(OrgDTO);
        return updatedOrg.toDTO();
  }
}
