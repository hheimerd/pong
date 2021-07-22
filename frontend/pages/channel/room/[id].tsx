import {useRouter} from 'next/router';
import {Chat, ChatForm, ChatMessageList} from '../../../components';
import {ChatContextProvider} from '../../../context/chat/chat.context';

const ChannelRoom = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <ChatContextProvider>
      <h1>Channel room id: {id}</h1>
      <Chat>
        <ChatMessageList id={parseInt(id, 10)}/>
        <ChatForm />
      </Chat>
    </ChatContextProvider>
  );
};

export default ChannelRoom;
