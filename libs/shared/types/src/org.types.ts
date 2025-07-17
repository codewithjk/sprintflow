

export interface CreateOrganizationDTO {
  name: string;
  email: string;
  password: string; // raw password to be hashed inside service
  description?: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  location?: string;
  phoneNumber?: string;
  role:"organization"
}
