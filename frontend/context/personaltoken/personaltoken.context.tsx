import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface IPersonalContext {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}

export const PersonalTokenContext = createContext<IPersonalContext>(
  {} as IPersonalContext
);

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
