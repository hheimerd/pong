import format from "date-fns/format";
import React from "react";
import { Avatar } from "../Avatar/Avatar";
import styles from "./ChatMessage.module.css";
import { ChatMessageProps } from "./ChatMessage.props";
import sanitizeHtml from "sanitize-html";

// Allow only a super restricted set of tags and attributes
const cleanMessage = (dirty) =>
  sanitizeHtml(dirty, {
    allowedTags: ["a"],
    allowedAttributes: {
      a: ["href"],
    },
    allowedIframeHostnames: ["www.youtube.com"],
  });

export const ChatMessage = ({
  onemessage,
  user,
}: ChatMessageProps): JSX.Element => {
  const { message, created_at } = onemessage;

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
          <p
            className={styles.message__text}
            dangerouslySetInnerHTML={{ __html: cleanMessage(message) }}
          ></p>
        </div>
      </div>
    </div>
  );
};
