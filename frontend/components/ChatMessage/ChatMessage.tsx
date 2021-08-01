import styles from "./ChatMessage.module.css";
import React from "react";
import { Avatar } from "../Avatar/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { ChatMessageProps } from "./ChatMessage.props";
import format from "date-fns/format";
import { parseISO } from "date-fns";

export const ChatMessage = ({ onemessage }: ChatMessageProps): JSX.Element => {
  const { user, message, created_at } = onemessage;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
            image={user.avatar.sm}
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
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
