import {useRouter} from 'next/router';
import React from 'react';
import {Chat, ChatForm, ChatMessageList, Htag} from '../../../components';
import {ChatContextProvider} from '../../../context/chat/chat.context';

const ChatRoom = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <ChatContextProvider>
      <Htag tag='h1'>Chat room id: {id}</Htag>
      <Chat>
        <ChatMessageList id={parseInt(id, 10)}/>
        <ChatForm />
      </Chat>
    </ChatContextProvider>
  );
};

export default ChatRoom;
