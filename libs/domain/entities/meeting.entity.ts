export interface MeetingProps {
    id: string;
    name: string;
    roomId: string;
    orgId: string;
    subject: string;
    startTime: Date;
    endTime: Date;
}

export class Meeting {
    constructor(private props: MeetingProps) {
        if (props.endTime <= props.startTime) {
            throw new Error("End time must be after start time.");
        }
    }
    get id() {
        return this.props.id;
    }

    get roomId() {
        return this.props.roomId;
    }

    get orgId() {
        return this.props.orgId;
    }

    get startTime() {
        return this.props.startTime;
    }

    get endTime() {
        return this.props.endTime;
    }
      toDTO() {
        return { ...this.props };
    }
     ownedBy(organizationId: string) {
        return organizationId === this.props.orgId;
    }

}
