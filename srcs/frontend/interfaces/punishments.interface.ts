export enum PunishmentDegree {
  BAN = "BAN",
  MUTE = "MUTE",
  SELF_MUTE = "SELF_MUTE",
}

export interface IChatPunishment {
  chatId?: string;
  fromUserId: number;
  degree: PunishmentDegree;
  toUserId: number;
  created_at: Date;
  minutes: number;
}
