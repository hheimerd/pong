import {IChatMessage} from "../../interfaces/message.interface";
import {ActionType, ChatActions} from "./chat.actions";

// Change this function, when it will be possible to fetch data from API
const fetchMessages = (id: number):Array<IChatMessage> => {
  return ([
    {
      user_id: "1",
      user_name: "Marge",
      user_avatar: "/photo_avatar.png",
      user_message: "Hello!"
    },
    {
      user_id: "2",
      user_name: "Ivan Smirnov",
      user_avatar: "",
      user_message: "Уедем, бросим край докучный И каменные города, Где Вам и холодно, и скучно, И даже страшно иногда.Нежней цветы и звезды ярче В стране, где светит Южный Крест, В стране богатой, словно ларчик Для очарованных невест."
    },
  ]);
};

export const reducer = (state: Array<IChatMessage>, action: ChatActions): Array<IChatMessage> => {
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
