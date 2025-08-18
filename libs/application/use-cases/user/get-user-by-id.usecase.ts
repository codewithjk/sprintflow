import { User } from "../../../domain/entities/user.entity";
import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
  ) {}
  async execute(id: string) {
      const userDTO = await this.userRepo.findById(id);
    if (!userDTO) throw new NotFoundError(Messages.USER_NOT_FOUND);
    const user = new User(userDTO);
      return user.toDTO();
  }
}
