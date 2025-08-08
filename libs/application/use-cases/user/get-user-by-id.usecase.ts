import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(id: string) {
      const user = await this.userRepo.findById(id);
      if (!user) throw new NotFoundError(Messages.USER_NOT_FOUND);
      return user.toDTO();
  }
}
