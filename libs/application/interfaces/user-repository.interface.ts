import { CreateUserDTO, UpdateUserDTO, UserDTO } from "../../shared/types/src";

export interface IUserRepository {
  create(user: CreateUserDTO): Promise<UserDTO>;
  update(id:string,data:UpdateUserDTO):Promise<UserDTO>;
  findByEmail(email: string): Promise<UserDTO | null>;
  findById(email: string): Promise<UserDTO | null>;
  find(filter : Partial<UserDTO>, skip: number, take: number) : Promise<{ users: UserDTO[]; total: number; page: number; pageSize: number; }>;
  
}
