import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../interfaces/user-repository.interface";




export class GetAllUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(filter:Partial<User>,page:number,limit:number) {
    const skip = (page - 1) * limit;
    return this.userRepo.find(filter, skip, limit);
  }
}