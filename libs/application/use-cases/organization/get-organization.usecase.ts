import { Organization } from "../../../domain/entities/organization.entity";
import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
export class GetOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
  ) {}
    async execute(id:string) {
      const orgDTO = await this.orgRepo.findById(id);
      if (!orgDTO) throw new NotFoundError(Messages.ORG_NOT_FOUND);
      const org = new Organization(orgDTO);
      return org.toDTO();
  }
}
