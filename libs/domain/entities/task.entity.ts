export interface TaskProps {
  id: string;
  title: string;
  description: string;
  status?: string |null;
  priority?: string |null;
  tags?: string | null;
  startDate: Date |string;
  endDate: Date |string;
  points?: number | null;
  projectId: string;
  assignedUserId: string;
  orgId: string;
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
  get orgId() {
    return this.props.orgId;
  }
  get projectId() {
    return this.props.projectId
  }
    ownedBy(organizationId: string) {
        return organizationId === this.props.orgId;
    }

  toDTO() {
    return { ...this.props };
  }
}
