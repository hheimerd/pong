import styles from './ChatForm.module.css';
import React, {useContext, useRef} from "react";
import {ChatContext} from '../../context/chat.context';
import {Avatar} from '../Avatar/Avatar';
// import {IChatMessage} from '../../interfaces/message.interface';

export const ChatForm = () => {
  const {dispatch} = useContext(ChatContext);
  const inputElement = useRef(null)
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // const msg: IChatMessage = { 
      //   user_id: 1,
      //   user_name: "Marge",
      //   user_avatar: "",
      //   user_message: 
      // }
      dispatch({
        type: 'SEND_MESSAGE',
        payload: inputElement.current.value
      })
      inputElement.current.value = ''
    }
  }

  return (
    <section className={styles.box}>
      <Avatar image="/photo_avatar.png"/>
      <input
        onKeyPress={handleKeyDown}
        className={styles.input}
        maxLength={250}
        placeholder="Сообщение..."
        autoComplete="off"
        ref={inputElement}
        id="messageContent"
      />
    </section>
  );
};
