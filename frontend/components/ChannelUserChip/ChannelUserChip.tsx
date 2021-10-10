import { useMutation } from "@apollo/client";
import { Avatar, Chip, Menu, MenuItem } from "@material-ui/core";
import id from "date-fns/locale/id/index";
import { useRouter } from "next/router";
import React from "react";
import { io } from "socket.io-client";
import { useSnackBar } from "../../context/snackbar/snackbar.context";
import { MY_CHATS_QUERY } from "../../graphql";
import {
  CREATE_MESSAGE_MUTATION,
  PUNISHMENT_USER_MUTATION,
  UNPUNISHMENT_USER_MUTATION,
} from "../../graphql/mutations";
import { ChatType, IChat } from "../../interfaces/chat.interface";
import { IChatPunishment } from "../../interfaces/punishments.interface";
import { IUserProfile } from "../../interfaces/userprofile.interface";

interface UserChipProps {
  user: IUserProfile;
  current_user_id: number;
  current_channel: IChat;
}

export const ChannelUserChip = ({
  user,
  current_user_id,
  current_channel,
}: UserChipProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const { updateSnackBarMessage } = useSnackBar();

  // ban user
  const [banUser, { data: dataP, loading: loadingP, error: errorP }] =
    useMutation(PUNISHMENT_USER_MUTATION, {
      refetchQueries: [{ query: MY_CHATS_QUERY }],
    });

  // ban user
  const [unbanUser, { data: dataU, loading: loadingU, error: errorU }] =
    useMutation(UNPUNISHMENT_USER_MUTATION, {
      refetchQueries: [{ query: MY_CHATS_QUERY }],
    });

  const [addMessage, { data: dataM, loading: loadingM, error: errorM }] =
    useMutation(CREATE_MESSAGE_MUTATION, {
      onError(err) {
        console.log(err);
        updateSnackBarMessage(err.message);
      },
    });

  // wait for fetching data
  if (loadingP || loadingU || loadingM)
    return <p>Loading user profile from graphql...</p>;
  if (errorP || errorU || errorM)
    return <p>Error: can't fetching data from graphql :(</p>;

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMute = () => {
    banUser({
      variables: {
        addUserPunishmentInChatDegree: "MUTE",
        addUserPunishmentInChatTargetUserId: user.id,
        addUserPunishmentInChatChatId: current_channel.id,
        addUserPunishmentInChatMinutes: 2,
      },
    });
    setAnchorEl(null);
  };

  const handleUnMute = () => {
    unbanUser({
      variables: {
        removeUserPunishmentInChatDegree: "MUTE",
        removeUserPunishmentInChatTargetUserId: user.id,
        removeUserPunishmentInChatChatId: current_channel.id,
      },
    });
    setAnchorEl(null);
  };

  const handleBan = () => {
    banUser({
      variables: {
        addUserPunishmentInChatDegree: "BAN",
        addUserPunishmentInChatTargetUserId: user.id,
        addUserPunishmentInChatChatId: current_channel.id,
        addUserPunishmentInChatMinutes: 20000,
      },
    });
    setAnchorEl(null);
  };

  const handleUnBan = () => {
    unbanUser({
      variables: {
        removeUserPunishmentInChatDegree: "BAN",
        removeUserPunishmentInChatTargetUserId: user.id,
        removeUserPunishmentInChatChatId: current_channel.id,
      },
    });
    setAnchorEl(null);
  };

  const handleBlock = () => {
    banUser({
      variables: {
        addUserPunishmentInChatDegree: "SELF_MUTE",
        addUserPunishmentInChatTargetUserId: user.id,
        addUserPunishmentInChatChatId: current_channel.id,
      },
    });
    setAnchorEl(null);
    router.replace(router.asPath);
  };

  const handleUnBlock = () => {
    unbanUser({
      variables: {
        removeUserPunishmentInChatDegree: "SELF_MUTE",
        removeUserPunishmentInChatTargetUserId: user.id,
        removeUserPunishmentInChatChatId: current_channel.id,
      },
    });
    setAnchorEl(null);
    router.replace(router.asPath);
  };

  async function createGame(socket, user: IUserProfile): Promise<number> {
    return new Promise((resolve, reject) => {
      socket.on("gameCreated", (o) => {
        const id = o?.game?.id;
        if (id !== undefined) {
          resolve(id);
        } else {
          reject(o);
        }
      });
      socket.emit("createGame", { name: user.name, userId: user.id });
    });
  }

  const handleInviteToGame = async (user: IUserProfile) => {
    const socket = io("ws://" + process.env.GAME_API_HOST, {
      extraHeaders: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    try {
      const gameId = await createGame(socket, user);
      console.log("Game created");
      // send message to back via mutation CREATE_MESSAGE_MUTATION
      addMessage({
        variables: {
          createChatMessageInput: {
            chatId: current_channel.id,
            message: `Game created, please <a href="http://${process.env.HOST}/game/${gameId}">open link</a>`,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
    setAnchorEl(null);
  };

  if (!user) return null;

  // const isCurrentUser = user.id === current_user_id ? true : false;

  const getBlockMenues = () => {
    const isBlocked = current_channel.punishments
      .filter((x: IChatPunishment) => x.degree == "SELF_MUTE")
      .filter((x: IChatPunishment) => x.toUserId === user.id).length;
    console.log("isBlocked", isBlocked);
    if (isBlocked) {
      return (
        <MenuItem onClick={handleUnBlock}>
          Unblock {user.name} messages
        </MenuItem>
      );
    }
    return (
      <MenuItem onClick={handleBlock}>Block {user.name} messages</MenuItem>
    );
  };

  const getAdminMenues = () => {
    const adminsIdArr = current_channel.admins.reduce((a, { id }) => {
      if (id) a.push(id);
      return a;
    }, []);

    const isBanned = current_channel.punishments
      .filter((x: IChatPunishment) => x.degree == "BAN")
      .filter((x: IChatPunishment) => x.toUserId === user.id).length;
    console.log("isBanned", isBanned);

    const isMuted = current_channel.punishments
      .filter((x: IChatPunishment) => x.degree == "MUTE")
      .filter((x: IChatPunishment) => x.toUserId === user.id).length;
    console.log("isBanned", isBanned);

    if (
      user.id !== current_user_id &&
      ((current_channel.ownerId &&
        current_channel.ownerId === current_user_id) ||
        adminsIdArr.includes(current_user_id))
    ) {
      return (
        <>
          {isBanned ? (
            <MenuItem onClick={handleUnBan}>Unban</MenuItem>
          ) : (
            <MenuItem onClick={handleBan}>Kick and ban {user.name}</MenuItem>
          )}
          {isMuted ? (
            <MenuItem onClick={handleUnMute}>Unmute</MenuItem>
          ) : (
            <MenuItem onClick={handleMute}>Mute {user.name}</MenuItem>
          )}
        </>
      );
    }
  };

  console.log("current_channel: ", current_channel);
  const getChipUserName = () => {
    let chipUserName = user.name;
    if (current_channel.ownerId === user.id) {
      chipUserName += " [owner]";
    }
    const isMuted = current_channel.punishments
      .filter((x: IChatPunishment) => x.degree == "MUTE")
      .filter((x: IChatPunishment) => x.toUserId === user.id).length;
    if (isMuted) {
      chipUserName += " [muted]";
    }
    return chipUserName;
  };

  return (
    <>
      <Chip
        avatar={
          <Avatar
            alt={user.name}
            src={
              "http://" + process.env.BACKEND_HOST + "/public/" + user.avatar[0]
            }
          />
        }
        label={getChipUserName()}
        color={current_channel.ownerId === user.id ? "primary" : "secondary"}
        onClick={handleClick}
      />
      <Menu
        id="simple-menu{user.id}"
        anchorEl={anchorEl}
        keepMounted={false}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => router.push("/users/" + user.id)}>
          View user profile
        </MenuItem>
        {user.id !== current_user_id ? (
          <MenuItem onClick={() => handleInviteToGame(user)}>
            Create game and invite {user.name}
          </MenuItem>
        ) : (
          ""
        )}
        {current_channel.type === ChatType.Channel &&
          current_channel.ownerId !== user.id &&
          user.id !== current_user_id &&
          getAdminMenues()}
        {user.id !== current_user_id && getBlockMenues()}
      </Menu>
      &nbsp;
    </>
  );
};
