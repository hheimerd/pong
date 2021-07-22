import styles from './ChatForm.module.css';
import React, {useContext, useRef} from "react";
import {ChatContext} from '../../context/chat/chat.context';
import {Avatar} from '../Avatar/Avatar';
// import {UserProfileContext} from '../../context/userprofile/userprofile.context';
import {IChatMessage} from '../../interfaces/message.interface';
import {ActionType} from '../../context/chat/chat.actions';
import {useQuery} from '@apollo/client';
import {PROFILE_QUERY} from '../../graphql'

export const ChatForm = (): JSX.Element => {
  // const {loading, error, data} = useContext(UserProfileContext);
  const { loading, error, data } = useQuery(
    PROFILE_QUERY,
    {
      fetchPolicy: "network-only", 
      pollInterval: 1000,
    }
  );
  const {dispatch} = useContext(ChatContext);
  const inputElement = useRef(null);

  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const msg: IChatMessage = { 
        user_id: data.getProfile.id,
        user_name: data.getProfile.name,
        user_avatar: '/photo_avatar.png',
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
      <Avatar image='/photo_avatar.png' alt={data.getProfile.name}/>
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
