import React, { createContext, Reducer, useReducer} from "react";
import {IChatMessage} from "../../interfaces/message.interface";
import {ChatActions} from "./chat.actions";
import {reducer} from "./chat.reducer";

export const ChatContext = createContext<{
    state: Array<IChatMessage>;
    dispatch: React.Dispatch<ChatActions>;
  }>({
    state: undefined,
    dispatch: () => undefined,
  });

export const ChatContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<Array<IChatMessage>, ChatActions>>(reducer, undefined);
  // useEffect(() => {
  //   dispatch({
  //     type: ActionType.GetMessages,
  //     payload: undefined
  //   });
  // }, []);
  return (
    <ChatContext.Provider value={{state, dispatch}}>
      {children}
    </ChatContext.Provider>
  );
};
