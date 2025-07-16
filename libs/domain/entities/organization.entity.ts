// libs/domain/entities/organization.entity.ts


export interface OrgProps{
  id: string;
  name: string;
  ownerId: string;
  subscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Organization {
  constructor(
   private readonly props : OrgProps
  ) { }
  get id() {
    return this.props.id;
  }
  get isPremium(): boolean {
    return !!this.props.subscriptionId;
  }

  rename(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Organization name cannot be empty.');
    }
    this.props.name = newName.trim();
    this.props.updatedAt = new Date();
  }

  attachSubscription(subscriptionId: string) {
    this.props.subscriptionId = subscriptionId;
    this.props.updatedAt = new Date();
  }

  detachSubscription() {
    this.props.subscriptionId = null;
    this.props.updatedAt = new Date();
  }

  isOwnedBy(userId: string): boolean {
    return this.props.ownerId === userId;
  }
  toDTO() {
    const { subscriptionId, ...other } = this.props;
    return other;
  }
}
