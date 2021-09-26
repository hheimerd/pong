export enum Role {
  Chat = "User",
  Channel = "Admin",
}

export enum UserStatus {
  Online = "Online",
  Offline = "Offline",
  InGame = "InGame",
}

export interface IUserProfile {
  id: number;
  name?: string;
  email?: string;
  login?: string;
  is_admin?: boolean;
  created_at?: Date;
  updated_at?: Date;
  avatar?: [string, string];
  roles?: Role;
  status?: UserStatus;
  TwoFactorAuth: boolean;
}
