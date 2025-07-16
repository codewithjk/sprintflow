import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class CreateOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute({ name, ownerId }: { name: string; ownerId: string }) {
    const org = await this.orgRepo.create(name, ownerId);
    await this.userRepo.update(ownerId,{orgId:org.id,role:"organization"})
    return org.toDTO();
  }
}
