import styles from './ChatMessage.module.css';
import React from "react";
import {Avatar} from "../Avatar/Avatar";
import {IChatMessage} from "../../interfaces/message.interface";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export const ChatMessage = ({user_avatar, user_name, user_message}: IChatMessage): JSX.Element => {
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
          <Avatar image={user_avatar} onClick={handleClick} aria-controls="simple-menu"/>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted={false}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
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
          <h3>{user_name}</h3>
          <p>{user_message}</p>
        </div>
      </div>
    </div>
  );
};
