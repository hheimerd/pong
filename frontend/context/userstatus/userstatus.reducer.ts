import { UserStatusActions, UserStatusActionType } from "./userstatus.actions";
import io from "socket.io-client";

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

export const reducer = (state: string, action: UserStatusActions): string => {
  console.log("=== reducer ===");
  switch (action.type) {
    case UserStatusActionType.UserConnect: {
      console.log("action.type: SendMessage");
      if (state == "disconnected") {
        statusServe();
      }
      return "connected";
    }
    case UserStatusActionType.UserDisconnect: {
      console.log("action.type: GetMessages");
      return "disconnected";
    }
  }
};
