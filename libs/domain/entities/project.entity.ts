
export interface ProjectProps {
    id: string;
    name: string;
    orgId: string;
    description: string;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export class Project {
    constructor(private readonly props: ProjectProps) { };
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    ownedBy(organizationId: string) {
        return organizationId === this.props.orgId;
    }
    toDTO() {
        return { ...this.props };
    }
}