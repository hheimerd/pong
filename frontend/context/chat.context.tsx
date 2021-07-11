import React, { createContext, Reducer, useReducer } from "react";
import {IChatMessage} from "../interfaces/message.interface";

const initialState: Array<IChatMessage> = [
    {
      user_id: 1,
      user_name: "Marge",
      user_avatar: "/photo_avatar.png",
      user_message: "Hello!"
    },
    {
      user_id: 2,
      user_name: "Ivan Smirnov",
      user_avatar: "",
      user_message: "Уедем, бросим край докучный И каменные города, Где Вам и холодно, и скучно, И даже страшно иногда.Нежней цветы и звезды ярче В стране, где светит Южный Крест, В стране богатой, словно ларчик Для очарованных невест."
    },
  ];

interface Action {
  type: "SEND_MESSAGE"
  payload: string
}

const reducer = (state: Array<IChatMessage>, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case "SEND_MESSAGE":
      console.log(type);
      const newMessage: IChatMessage = {
        user_id: 1,
        user_name: "Marge",
        user_avatar: "/photo_avatar.png",
        user_message: payload
      }
      return [...state, newMessage];
    default:
      return state;
  }
};

export const ChatContext = createContext<{
    state: Array<IChatMessage>;
    dispatch: React.Dispatch<Action>;
  }>({
    state: initialState,
    dispatch: () => undefined,
  });

export const ChatContextProvider: React.FC = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer<Reducer<Array<IChatMessage>, Action>>(reducer, initialState);
  return (
    <ChatContext.Provider value={{state, dispatch}}>
      {children}
    </ChatContext.Provider>
  );
}
