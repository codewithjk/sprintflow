import { Organization } from "../../domain/entities/organization.entity";
import { CreateOrganizationDTO } from "../../shared/types/src/org.types";

export interface IOrganizationRepository {
  create(data :CreateOrganizationDTO ): Promise<Organization>;
  update(id: string, data: Partial<Organization>): Promise<Organization>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Organization | null>;
  findByEmail(id: string): Promise<Organization | null>;
  searchOrganizations(search: string, skip: number, take: number): Promise<{ orgs: Partial<Organization>[]; total: number; page: number; pageSize: number; }>;
  findByName(name: string): Promise<Organization | null>;
}
