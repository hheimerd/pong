import styles from './ChatMessage.module.css';
import React from "react";
import {Avatar} from "../Avatar/Avatar";
import {IChatMessage} from "../../interfaces/message.interface";

export const ChatMessage = ({user_avatar, user_name, user_message}: IChatMessage): JSX.Element => {
  return (
      <div className={styles.box}>
        <div className={styles.wrapper}>
          <div className={styles.image}>
            <Avatar image={user_avatar}/>
          </div>
          <div className={styles.message}>
            <h3>{user_name}</h3>
            <p>{user_message}</p>
          </div>
        </div>
      </div>
  );
};
