import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";
import { UserStatus } from "../../interfaces/userprofile.interface";

interface IUserStatusContext {
  status: UserStatus;
  setStatus: Dispatch<SetStateAction<string>>;
}

export const UserStatusContext = createContext<IUserStatusContext>(
  {} as IUserStatusContext
);

const statusServe = () => {
  const socket = io("ws://" + process.env.GAME_API_HOST, {
    extraHeaders: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  socket.on("connect", () => {
    console.log("socket connect", socket.id);
  });
  window.addEventListener("logout", () => {
    socket.disconnect();
  });
};

export const UserStatusContextProvider: React.FC = ({ children }) => {
  const [status, setStatus] = useState<UserStatus>(UserStatus.Offline);

  useEffect(() => {
    switch (status) {
      case UserStatus.Online:
        statusServe();
        break;
      case UserStatus.Offline:
        dispatchEvent(new Event("logout"));
        break;
      default:
    }
  }, [status]);

  return (
    <UserStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
};
