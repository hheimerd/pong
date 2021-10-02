import React, { createContext, Reducer, useReducer } from "react";
import { UserStatusActions } from "./userstatus.actions";
import { reducer } from "./userstatus.reducer";

export const UserStatusContext = createContext<{
  state: string;
  dispatch: React.Dispatch<UserStatusActions>;
}>({
  state: undefined,
  dispatch: () => undefined,
});

export const UserStatusContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<string, UserStatusActions>>(
    reducer,
    undefined
  );
  return (
    <UserStatusContext.Provider value={{ state, dispatch }}>
      {children}
    </UserStatusContext.Provider>
  );
};
