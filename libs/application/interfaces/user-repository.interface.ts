import { User } from "../../domain/entities/user.entity";
import { CreateUserDTO } from "../../shared/types/src";


export interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
