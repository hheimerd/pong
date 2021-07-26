export interface IUserProfile {
  id: string;
  name?: string;
  email?: string;
  is_admin?: boolean;
  created_at?: Date;
  updated_at?: Date;
  avatar?: {
    sm?: string;
    lg?: string;
  };
}
