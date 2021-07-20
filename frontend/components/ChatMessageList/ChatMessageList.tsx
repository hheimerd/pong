import styles from './ChatMessageList.module.css';
import React, {useContext, useEffect, useRef} from "react";
import {ChatMessage} from '../ChatMessage/ChatMessage';
import {IChatMessage} from '../../interfaces/message.interface';
import {ChatContext} from '../../context/chat.context';

export const ChatMessageList = (): JSX.Element => {
  const {state} = useContext(ChatContext);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(
    () => {
      console.log(state);
      messagesEndRef?.current?.scrollIntoView({ block: "end", inline: "nearest", behavior: "smooth" });
    },
    [state]
  );

  const Messages = Array.from(state).map((onemessage: IChatMessage, i: number) => {
    return (
      <React.Fragment key={i}>
        <ChatMessage
          user_name={onemessage.user_name}
          user_avatar={onemessage.user_avatar}
          user_message={onemessage.user_message}/>
      </React.Fragment>
    );
  });
  return <div className={styles.wrapper}>{Messages}<div ref={messagesEndRef} /></div>;
};
