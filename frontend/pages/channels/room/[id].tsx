import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Chat, ChatForm, ChatMessageList, Htag } from '../../../components';
import { ChatContextProvider } from '../../../context/chat/chat.context';
import { CHATS_QUERY } from '../../../graphql';
import { IChat } from '../../../interfaces/chat.interface';

const ChannelRoom = (): JSX.Element => {
  const { loading, error, data } = useQuery(CHATS_QUERY);
  const router = useRouter();
  const { id } = router.query;

  // get current channel from current user profile
  const getChannel = () => {
    const channel = data.getProfile.chats.filter(
      (x: IChat) => x.id === id
    )[0];
    return channel;
  };

  // on loading
  useEffect(() => {
    if (!loading)
      document.title = "Channel: " + getChannel().name;
  }, [loading]);

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  // check slug type
  if (typeof id !== "string") return null;

  return (
    <ChatContextProvider>
      <Htag tag='h1'>{getChannel().name}</Htag>
      <Chat>
        <ChatMessageList id={id}/>
        <ChatForm id={id}/>
      </Chat>
    </ChatContextProvider>
  );
};

export default ChannelRoom;
