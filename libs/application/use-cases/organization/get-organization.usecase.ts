import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
export class GetOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
  ) {}
    async execute(id:string) {
      const org = await this.orgRepo.findById(id);
      if (!org) throw new NotFoundError(Messages.ORG_NOT_FOUND);
      return org.toDTO();
  }
}
