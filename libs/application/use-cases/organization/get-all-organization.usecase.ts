import { Organization } from "../../../domain/entities/organization.entity";
import { OrganizationDTO } from "../../../shared/types/src";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";

export class GetAllOrganizationUseCase {
  constructor(private readonly orgRepo: IOrganizationRepository) {}

  async execute(filter:Partial<OrganizationDTO>,page:number,limit:number) {
    const skip = (page - 1) * limit;
    const {orgs,...rest} = await this.orgRepo.find(filter, skip, limit);

    return {
      orgs: orgs.map((org) => new Organization(org).toDTO()),
      ...rest,
    }
  }
}