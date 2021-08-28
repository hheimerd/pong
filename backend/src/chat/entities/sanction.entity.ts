import { Chat, User } from ".prisma/client";

enum SanctionDegree {
  BAN,
  MUTE,
  SELF_MUTE
}

class Sanction {
  sendSanction(chat, from, degree, to) {}

  id: string;
  chat: Chat;
  from: User;
  to: User;
  degree: SanctionDegree
}

