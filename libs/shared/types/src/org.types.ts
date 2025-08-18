
// Response
export interface OrganizationDTO {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  profileUrl?: string| null;
  website?: string| null;
  industry?: string| null;
  location?: string| null;
  phoneNumber?: string| null;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
  role: "organization";
  password?: string | null;
  subscriptionId?: string | null;
}
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


export interface UpdateOrganizationDTO {
  name?: string;
  email?: string;
  description?: string ;
  profileUrl?: string;
  website?: string;
  industry?: string;
  location?: string;
  phoneNumber?: string;
  subscriptionId?: string;
  plan?: string ;
}
export interface stripePlanDTO{
  email: string | null | undefined,
      subscriptionId :string,
      plan :string,
      startDate: Date,
      endDate :Date,
      period:string,
}


export type InvitationData = {
  token: string;
  orgId: string;
  email: string;
  status: "pending" | "used";
  timestamp: number;
};

