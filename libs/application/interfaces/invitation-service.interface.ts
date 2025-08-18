export interface InvitationData {
  token: string;
  orgId: string;
  email: string;
  status: "pending" | "used";
  timestamp: number;
}
export interface CreateInvitationInput {
  orgId: string;
  email: string;
}

export interface IInvitationService {

  createInvitation(data: CreateInvitationInput): Promise<string>;
  getInvitation(token: string): Promise<InvitationData | null>;
  markUsed(token: string): Promise<void>;
  removeInvitation(token: string): Promise<void>
}