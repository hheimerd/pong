import styles from './ChatForm.module.css';
import React, {useContext, useEffect, useRef} from "react";
import {ChatContext} from '../../context/chat.context';
import {Avatar} from '../Avatar/Avatar';
import {UserProfileContext} from '../../context/userprofile.context';

export const ChatForm = () => {
  const {avatar} = useContext(UserProfileContext);
  const {dispatch} = useContext(ChatContext);
  const inputElement = useRef(null);
  
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
      });
      inputElement.current.value = '';
    }
  };

  // if(!avatar) return null

  return (
    <section className={styles.box}>
      {avatar && <Avatar image={avatar.sm}/>}
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
