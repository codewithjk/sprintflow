

export interface CreateOrganizationDTO {
  name: string;
  email: string;
  password: string; // raw password to be hashed inside service
  description?: string ;
  profileUrl?: string;
  website?: string;
  industry?: string;
  location?: string;
  phoneNumber?: string;
  role:"organization"
}


export type InvitationData = {
  token: string;
  orgId: string;
  email: string;
  status: "pending" | "used";
  timestamp: number;
};

