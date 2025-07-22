export interface TaskProps {
  id: string;
  title: string;
  description: string;
  status?: string |null;
  priority?: string |null;
  tags?: string | null;
  startDate: Date;
  endDate: Date;
  points?: number | null;
  projectId: string;
  assignedUserId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  constructor(private props: TaskProps) {}

  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
    ownedBy(organizationId: string) {
        return organizationId === this.props.authorId;
    }

  toDTO() {
    return { ...this.props };
  }
}
