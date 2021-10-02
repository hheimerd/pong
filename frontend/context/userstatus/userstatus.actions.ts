export enum UserStatusActionType {
  UserConnect,
  UserDisconnect,
}

interface UserConnect {
  type: UserStatusActionType.UserConnect;
  // payload: IChatMessage;
}

interface UserDisconnect {
  type: UserStatusActionType.UserDisconnect;
  // payload: string;
}

export type UserStatusActions = UserConnect | UserDisconnect;
