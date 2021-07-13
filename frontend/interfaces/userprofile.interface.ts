export interface IUserProfile {
  id: string,
  name: string,
  email: string,
  is_admin: false,
  created_at: string,
  updated_at: string,
  avatar: {
    sm: string,
    lg: string,
  },
}
