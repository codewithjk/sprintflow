import { User } from "../../../domain/entities/user.entity";
import { UserDTO } from "../../../shared/types/src";
import { IUserRepository } from "../../interfaces/user-repository.interface";

export class GetAllUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) { }

  async execute(filter: Partial<UserDTO>, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { users, ...rest } = await this.userRepo.find(filter, skip, limit);
    return {
      users: users.map((user) => new User(user).toDTO()),
      ...rest,
    }
  }
}