import { IChatMessage } from "../../interfaces/message.interface";

export enum ActionType {
  SendMessage,
  GetMessages,
  GetChatsList,
  GetChannelsList,
}

interface SendMessage {
  type: ActionType.SendMessage;
  payload: IChatMessage;
}

interface GetMessages {
  type: ActionType.GetMessages;
  payload: string;
}

interface GetChatsList {
  type: ActionType.GetChatsList;
  payload: Array<string>;
}

interface GetChannelsList {
  type: ActionType.GetChannelsList;
  payload: Array<string>;
}

export type ChatActions =
  | SendMessage
  | GetMessages
  | GetChatsList
  | GetChannelsList;
