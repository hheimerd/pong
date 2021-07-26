import {IUserProfile} from "./userprofile.interface";

export enum ChatType {
  Chat = "CHAT",
  Channel = "CHANNEL",
}

export interface IChat {
  id?: string;
  name?: string;
  users?: IUserProfile[];
  admins?: IUserProfile[];
  owner?: IUserProfile;
  type?: ChatType;
  is_private?: boolean;
  password?: string;
}

