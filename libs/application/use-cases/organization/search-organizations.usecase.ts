import { Organization } from "../../../domain/entities/organization.entity";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";

interface SearchOrgsInput {
  search: string;
  page: number;
  limit: number;
}

export class SearchOrganizationsUseCase {
  constructor(private readonly orgRepo: IOrganizationRepository) {}

  async execute({ search, page, limit }: SearchOrgsInput) {
    const skip = (page - 1) * limit;

     const {orgs,...rest} = await this.orgRepo.searchOrganizations(search, skip, limit);
    
        return {
          orgs: orgs.map((org) => new Organization(org).toDTO()),
          ...rest,
        }
  }
}
