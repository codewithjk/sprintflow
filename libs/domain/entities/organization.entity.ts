export interface OrgProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string; 
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  inviteCode?: string | null;
  plan: string;
  subscriptionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Organization {
  constructor(private props: OrgProps) {}

  // === Getters ===
  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get plan() {
    return this.props.plan;
  }

  get isPremium(): boolean {
    return !!this.props.subscriptionId || this.props.plan.toLowerCase() !== 'free';
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  // === Business Logic ===

  rename(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Organization name cannot be empty.');
    }
    this.props.name = newName.trim();
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string) {
    this.props.description = description?.trim();
    this.props.updatedAt = new Date();
  }

  attachSubscription(subscriptionId: string) {
    this.props.subscriptionId = subscriptionId;
    this.props.plan = 'premium';
    this.props.updatedAt = new Date();
  }

  detachSubscription() {
    this.props.subscriptionId = null;
    this.props.plan = 'free';
    this.props.updatedAt = new Date();
  }


  isEmailMatch(email: string) {
    return this.props.email.toLowerCase() === email.toLowerCase();
  }

  getPassword() {
    return this.props.password;
  }
  // === Public-safe DTO ===
  toDTO() {
    return {
      id: this.props.id,
      name: this.props.name,
      email: this.props.email,
      description: this.props.description,
      logoUrl: this.props.logoUrl,
      website: this.props.website,
      industry: this.props.industry,
      location: this.props.location,
      phoneNumber: this.props.phoneNumber,
      plan: this.props.plan,
      isPremium: this.isPremium,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      role: this.props.role,
    };
  }
}
