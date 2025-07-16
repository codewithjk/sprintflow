import { Organization } from "../../domain/entities/organization.entity";

export interface IOrganizationRepository {
  create(name: string, ownerId: string): Promise<Organization>;
  update(id: string, data: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Organization | null>;
}
