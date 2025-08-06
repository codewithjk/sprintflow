import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(id: string) {
      console.log(id)
      const user = await this.userRepo.findById(id);
      console.log(user)
      if (!user) throw new NotFoundError(Messages.USER_NOT_FOUND);
      return user.toDTO();
  }
}
