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
    return this.orgRepo.searchOrganizations(search, skip, limit);
  }
}
