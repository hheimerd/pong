import { Avatar, Chip, Menu, MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import { IUserProfile } from "../../interfaces/userprofile.interface";

interface UserChipProps {
  user: IUserProfile;
  current_user_id: number;
}

export const ChannelUserChip = ({
  user,
  current_user_id,
}: UserChipProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!user) return null;

  const isCurrentUser = user.id === current_user_id ? true : false;
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
        <MenuItem onClick={() => router.push("/game/join/" + user.id)}>
          Start game
        </MenuItem>
        <MenuItem onClick={handleClose}>
          Ban for 10 minutes {user.name}
        </MenuItem>
      </Menu>
      &nbsp;
    </>
  );
};
