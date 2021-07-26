import {DetailedHTMLProps, HTMLAttributes} from "react";
import {IChatMessage} from "../../interfaces/message.interface";

export interface ChatMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onemessage: IChatMessage
}
