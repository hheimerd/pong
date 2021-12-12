import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IChatMessage } from "../../interfaces/message.interface";
import { IUserProfile } from "../../interfaces/userprofile.interface";

export interface ChatMessageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onemessage: IChatMessage;
  user: IUserProfile;
}
