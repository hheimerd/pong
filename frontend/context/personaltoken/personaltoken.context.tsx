import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserStatus } from "../../interfaces/userprofile.interface";
import { UserStatusContext } from "../userstatus/userstatus.context";

interface IPersonalContext {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}

export const PersonalTokenContext = createContext<IPersonalContext>(
  {} as IPersonalContext
);

export const PersonalTokenContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const { setStatus } = useContext(UserStatusContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Get token from localStorage and set to state:", token);
      setToken(token);
      setStatus(UserStatus.Online);
    }
  }, []);

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    if (token != null && token != localStorageToken) {
      console.log("Set localStorage token to:", token);
      window.localStorage.setItem("token", token);
      setStatus(UserStatus.Online);
    }
  }, [token]);

  return (
    <PersonalTokenContext.Provider value={{ token, setToken }}>
      {children}
    </PersonalTokenContext.Provider>
  );
};
