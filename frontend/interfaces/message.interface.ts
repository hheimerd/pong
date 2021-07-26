import {IUserProfile} from "./userprofile.interface";

export interface IChatMessage {
  chat?: number;
  created_at: Date;
  message: string;
  user: IUserProfile;
}
