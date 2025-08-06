export interface ChatProps {
  id: string;
  orgId: string;
  userId: string;
  content: string;
  createdAt: Date;
}
export class Chat {
  constructor(private props: ChatProps) {}
  toDTO() { return this.props; }
}
