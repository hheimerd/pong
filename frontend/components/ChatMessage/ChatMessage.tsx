import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import format from "date-fns/format";
import router from "next/router";
import React from "react";
import { Avatar } from "../Avatar/Avatar";
import styles from "./ChatMessage.module.css";
import { ChatMessageProps } from "./ChatMessage.props";

export const ChatMessage = ({
  onemessage,
  user,
}: ChatMessageProps): JSX.Element => {
  const { userId, message, created_at } = onemessage;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // console.log("user", user);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.box}>
      <div className={styles.wrapper}>
        <div className={styles.image}>
          <Avatar
            image={user.avatar ? user.avatar.sm : ""}
            alt={user.name}
            onClick={handleClick}
            aria-controls="simple-menu"
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted={false}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={() => router.push("/users/" + user.id)}>
              View user profile
            </MenuItem>
            <MenuItem onClick={() => router.push("/game/join/" + user.id)}>
              Start game
            </MenuItem>
            <MenuItem onClick={handleClose}>Ban for 10 minutes</MenuItem>
            <MenuItem onClick={handleClose}>Make admin</MenuItem>
            <MenuItem onClick={handleClose}>Add to blacklist</MenuItem>
            <MenuItem onClick={handleClose}>Remove from channel</MenuItem>
          </Menu>
        </div>
        <div className={styles.message}>
          <h3 className={styles.message__name}>{user.name}</h3>
          <div className={styles.message__date}>
            {format(new Date(created_at), "H:mm")}
          </div>
          <p className={styles.message__text}>{message}</p>
        </div>
      </div>
    </div>
  );
};
