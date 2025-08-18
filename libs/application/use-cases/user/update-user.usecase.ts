
import { User } from "../../../domain/entities/user.entity";
import { Messages } from "../../../shared/constants/messages";
import {  NotFoundError } from "../../../shared/errors/app-error";
import { UpdateUserDTO } from "../../../shared/types/src";
import { IUserRepository } from "../../interfaces/user-repository.interface";



export class UpdateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
  ) {}

    async execute({ id, data }: { id: string; data :UpdateUserDTO}) {
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundError(Messages.USER_NOT_FOUND);
      }
  
      const updatedUserDTO = await this.userRepo.update(id, data);
      const updatedUser = new User(updatedUserDTO)
        return updatedUser.toDTO();
  }
}
