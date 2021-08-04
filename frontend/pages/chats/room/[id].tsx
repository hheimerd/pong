import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Chat, ChatForm, ChatMessageList, Htag } from '../../../components';
import { ChatContextProvider } from '../../../context/chat/chat.context';
import { CHATS_QUERY } from '../../../graphql/queries';
import { IChat } from '../../../interfaces/chat.interface';
import { IUserProfile } from '../../../interfaces/userprofile.interface';

const ChatRoom = (): JSX.Element => {
  const { loading, error, data } = useQuery(CHATS_QUERY);
  const router = useRouter();
  const { id } = router.query;

  // get friend name from current chat
  const getFriendName = () => {
    return chats[0].members.filter((x: IUserProfile) => x.id !== current_user_id)[0].name;
  };

  // on loading
  useEffect(() => {
    if (!loading)
      document.title = "Chat: " + getFriendName();
  }, [loading]);

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;
  if (typeof id !== "string") return null;

  const current_user_id = data.getProfile.id;

  // filter chats only with ChatType == Chat
  const chats = data.getProfile.chats.filter(
    (x: IChat) => x.id === id
  );
  // console.log(chats);

  return (
    <ChatContextProvider>
      <Htag tag='h1'>Chat: {getFriendName()}</Htag>
      <Chat>
        <ChatMessageList id={id}/>
        <ChatForm id={id}/>
      </Chat>
    </ChatContextProvider>
  );
};

export default ChatRoom;
