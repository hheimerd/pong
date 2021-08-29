import { useMutation } from "@apollo/client";
import { Avatar, Chip, Menu, MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { MY_CHATS_QUERY } from "../../graphql";
import {
  PUNISHMENT_USER_MUTATION,
  UNPUNISHMENT_USER_MUTATION,
} from "../../graphql/mutations";
import { IChat } from "../../interfaces/chat.interface";
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

  const handleBan = () => {
    banUser({
      variables: {
        addUserPunishmentInChatDegree: "BAN",
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

  if (!user) return null;

  // const isCurrentUser = user.id === current_user_id ? true : false;

  const getMenues = () => {
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
            <MenuItem onClick={handleBan}>
              Ban for 2 minutes {user.name}
            </MenuItem>
          )}
          {isMuted ? (
            <MenuItem onClick={handleUnMute}>Unmute</MenuItem>
          ) : (
            <MenuItem onClick={handleMute}>
              Mute for 2 minutes {user.name}
            </MenuItem>
          )}
        </>
      );
    }
  };
  console.log("current_channel: ", current_channel.admins);
  return (
    <>
      <Chip
        avatar={
          <Avatar
            alt={user.name}
            src={process.env.IMAGES_LINK + "public/" + user.avatar[0]}
          />
        }
        label={user.name}
        color="secondary"
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
          <MenuItem onClick={() => router.push("/game/join/" + user.id)}>
            Start game
          </MenuItem>
        ) : (
          ""
        )}
        {getMenues()}
      </Menu>
      &nbsp;
    </>
  );
};
