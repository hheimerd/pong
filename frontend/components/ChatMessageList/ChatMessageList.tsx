import styles from './ChatMessageList.module.css';
import React, {useContext, useEffect, useRef} from "react";
import {ChatMessage} from '../ChatMessage/ChatMessage';
import {IChatMessage} from '../../interfaces/message.interface';
import {ChatContext} from '../../context/chat/chat.context';
import {ChatMessageListProps} from './ChatMessageList.props';
import {ActionType} from '../../context/chat/chat.actions';

export const ChatMessageList = ({id}: ChatMessageListProps): JSX.Element => {
  const {state, dispatch} = useContext(ChatContext);

  useEffect(() => {
    console.log("ChatMessageList useEffect, state: " + state);
    dispatch({
      type: ActionType.GetMessages,
      payload: id
    });
  }, []);

  // Make ref for scrolling to down of message list
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ block: "end", inline: "nearest", behavior: "smooth" });
  }, [state]);

  // wait until state will be ready
  if(!state) return null;
  
  // iterate over all messages
  const Messages = Array.from(state).map((onemessage: IChatMessage, i: number) => {
    return (
      <React.Fragment key={i}>
        <ChatMessage onemessage={onemessage}/>
      </React.Fragment>
    );
  });
  return <div className={styles.wrapper}>{Messages}<div ref={messagesEndRef}/></div>;
};
