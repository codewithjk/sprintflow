import { CreateOrganizationDTO, OrganizationDTO, UpdateOrganizationDTO } from "../../shared/types/src/org.types";

export interface IOrganizationRepository {
  create(data :CreateOrganizationDTO ): Promise<OrganizationDTO>;
  update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationDTO>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<OrganizationDTO | null>;
  findByEmail(email: string): Promise<OrganizationDTO | null>;
  searchOrganizations(search: string, skip: number, take: number): Promise<{ orgs: OrganizationDTO[]; total: number; page: number; pageSize: number; }>;
  findByName(name: string): Promise<OrganizationDTO | null>;
  find(filter : Partial<OrganizationDTO>, skip: number, take: number) : Promise<{ orgs: OrganizationDTO[]; total: number; page: number; pageSize: number; }>;
}
