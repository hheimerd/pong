import { IChatMessage } from "../../interfaces/message.interface";
import { ActionType, ChatActions } from "./chat.actions";

// Change this function, when it will be possible to fetch data from API
const fetchMessages = (id: string): Array<IChatMessage> => {
  return [
    {
      message: "Hello!",
      created_at: new Date(),
      user: {
        id: "1",
        name: "Marge",
        email: "none@none.ru",
        is_admin: false,
        avatar: {
          sm: "/photo_avatar.png",
          lg: "/photo_avatar.png",
        },
      },
    },
    {
      message:
        "Уедем, бросим край докучный И каменные города, Где Вам и холодно, и скучно, И даже страшно иногда.Нежней цветы и звезды ярче В стране, где светит Южный Крест, В стране богатой, словно ларчик Для очарованных невест.",
      created_at: new Date(),
      user: {
        id: "2",
        name: "Ivan Smirnov",
        email: "none@none.ru",
        is_admin: false,
        avatar: {
          sm: "/photo_avatar.png",
          lg: "/photo_avatar.png",
        },
      },
    },
  ];
};

export const reducer = (
  state: Array<IChatMessage>,
  action: ChatActions
): Array<IChatMessage> => {
  console.log("=== reducer ===");
  switch (action.type) {
    case ActionType.SendMessage: {
      console.log("action.type: SendMessage");
      return [...state, action.payload];
    }
    case ActionType.GetMessages: {
      console.log("action.type: GetMessages");
      return fetchMessages(action.payload);
    }
    default:
      return state;
  }
};
