import styles from './ChatForm.module.css';
import React, {useContext, useRef} from "react";
import {ChatContext} from '../../context/chat/chat.context';
import {Avatar} from '../Avatar/Avatar';
import {UserProfileContext} from '../../context/userprofile/userprofile.context';
import {IChatMessage} from '../../interfaces/message.interface';
import {ActionType} from '../../context/chat/chat.actions';

export const ChatForm = (): JSX.Element => {
  const {avatar, name, id} = useContext(UserProfileContext);
  const {dispatch} = useContext(ChatContext);
  const inputElement = useRef(null);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const msg: IChatMessage = { 
        user_id: id,
        user_name: name,
        user_avatar: avatar.sm,
        user_message: inputElement.current.value
      };
      dispatch({
        type: ActionType.SendMessage,
        payload: msg
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
