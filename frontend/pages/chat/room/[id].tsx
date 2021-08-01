import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { Chat, ChatForm, ChatMessageList, Htag } from '../../../components';
import { ChatContextProvider } from '../../../context/chat/chat.context';
import { CHATS_QUERY } from '../../../graphql/queries';
import { ChatType, IChat } from '../../../interfaces/chat.interface';

const ChatRoom = (): JSX.Element => {
  const { loading, error, data } = useQuery(CHATS_QUERY);
  const router = useRouter();
  const { id } = router.query;

  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;
  if (typeof id !== "string") return null;

  const current_user_id = data.getProfile.id;
  // filter chats only with ChatType == Chat
  const chats = data.getProfile.chats.filter(
    (x: IChat) => x.type === ChatType.Chat
  );
  console.log(chats);
  const friend = chats[0].members.filter((x) => x.id !== current_user_id);
  console.log(friend);

  return (
    <ChatContextProvider>
      <Htag tag='h1'>Chat with {friend[0].name}</Htag>
      <Chat>
        <ChatMessageList id={id}/>
        <ChatForm />
      </Chat>
    </ChatContextProvider>
  );
};

export default ChatRoom;
