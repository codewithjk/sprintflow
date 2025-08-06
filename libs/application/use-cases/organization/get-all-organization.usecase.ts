import { OrgProps } from "../../../domain/entities/organization.entity";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";




export class GetAllOrganizationUseCase {
  constructor(private readonly orgRepo: IOrganizationRepository) {}

  async execute(filter:Partial<OrgProps>,page:number,limit:number) {
    const skip = (page - 1) * limit;
    return this.orgRepo.find(filter, skip, limit);
  }
}