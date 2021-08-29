import { IChatMessage } from "./message.interface";
import { IUserProfile } from "./userprofile.interface";

export enum ChatType {
  Chat = "Chat",
  Channel = "Channel",
}

export interface IChat {
  id?: string;
  name?: string;
  members?: IUserProfile[];
  admins?: IUserProfile[];
  ownerId?: number;
  type?: ChatType;
  is_private?: boolean;
  password?: string;
  hasPassword?: boolean;
  messages: [IChatMessage];
  punishments: [IChatPunishment];
}
