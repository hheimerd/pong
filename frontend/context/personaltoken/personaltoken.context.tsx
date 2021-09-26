import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";

interface IPersonalContext {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
}

export const PersonalTokenContext = createContext<IPersonalContext>(
  {} as IPersonalContext
);

const statusServe = () => {
  const socket = io("ws://" + process.env.GAME_API_HOST, {
    extraHeaders: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  socket.on("connect", () => {
    console.log("socket connect", socket.id); // x8WIv7-mJelg7on_ALbx
  });
  window.addEventListener("logout", () => {
    socket.disconnect();
  });
};

export const PersonalTokenContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string>({} as string);

  useEffect(() => {
    const tkn = localStorage.getItem("token");
    setToken(tkn);
    console.log("PersonalTokenContext useEffect onLoading token: ", tkn);
    if (tkn) {
      statusServe();
    }
  }, []);

  return (
    <PersonalTokenContext.Provider value={{ token, setToken }}>
      {children}
    </PersonalTokenContext.Provider>
  );
};
