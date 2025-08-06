
import { User } from "../../../domain/entities/user.entity";
import { Messages } from "../../../shared/constants/messages";
import {  NotFoundError } from "../../../shared/errors/app-error";
import { IUserRepository } from "../../interfaces/user-repository.interface";



export class UpdateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
  ) {}

    async execute({ id, data }: { id: string; data :Partial<User>}) {
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundError(Messages.USER_NOT_FOUND);
      }
  
        const updatedOrg = await this.userRepo.update(id, data);
        return updatedOrg.toDTO();
  }
}
