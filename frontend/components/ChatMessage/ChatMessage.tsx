import format from "date-fns/format";
import React from "react";
import { Avatar } from "../Avatar/Avatar";
import styles from "./ChatMessage.module.css";
import { ChatMessageProps } from "./ChatMessage.props";

export const ChatMessage = ({
  onemessage,
  user,
}: ChatMessageProps): JSX.Element => {
  const { message, created_at } = onemessage;

  // console.log("user", user);

  return (
    <div className={styles.box}>
      <div className={styles.wrapper}>
        <div className={styles.image}>
          <Avatar
            image={user.avatar}
            alt={user.name}
            aria-controls="simple-menu"
          />
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
