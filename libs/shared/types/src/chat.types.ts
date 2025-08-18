
// Request
export interface CreateChatDTO {
  content: string;
  userId: string;
  orgId: string;
   createdAt: Date;
}

// Response
export interface ChatDTO {
  id: string;
  content: string;
  userId: string;
  orgId: string;
  createdAt: Date;
}
