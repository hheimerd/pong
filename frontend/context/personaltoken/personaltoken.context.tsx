import React, { createContext, useEffect, useState } from "react";

export const PersonalTokenContext = createContext({});

export const PersonalTokenContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string>({} as string);

  useEffect(() => {
    const tkn = localStorage.getItem("token");
    setToken(tkn);
    console.log("PersonalTokenContext useEffect onLoading token: ", tkn);
  }, []);

  return (
    <PersonalTokenContext.Provider value={{ token, setToken }}>
      {children}
    </PersonalTokenContext.Provider>
  );
};
