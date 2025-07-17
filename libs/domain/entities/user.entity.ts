
export interface UserProps {
  id: string;
  name: string;
  email: string;
  password?: string |null;
  role: "user" | "super_admin" ;
  isOwner: boolean;
  isBlocked: boolean;
  orgId?: string | null;
  oAuthId?: string;
  authProvider: 'local' | 'google' | 'github' | null;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }
  get role() {
    return this.props.role;
  }
  get orgId() {
    return this.props.orgId
  }
  // internal use
  getAuthProvider() {
    return this.props.authProvider;
  }
  getPassword(): string |null {
    if (!this.props.password) {
      return null
    }
    return this.props.password;
  }
  isAdmin() {
    return this.props.role === "super_admin";
  }


  toDTO() {
    const { password, ...dto } = this.props;
    return dto;
  }
}
