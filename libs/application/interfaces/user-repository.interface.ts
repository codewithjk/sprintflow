import { User, UserProps } from "../../domain/entities/user.entity";
import { CreateUserDTO } from "../../shared/types/src";


export interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  update(id:string,data:Partial<User>):Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  find(filter : Partial<UserProps>, skip: number, take: number) : Promise<{ users: Partial<User>[]; total: number; page: number; pageSize: number; }>;
  
}
