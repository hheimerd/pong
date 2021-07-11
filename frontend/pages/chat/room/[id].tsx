import {useRouter} from 'next/router'
import {Chat, ChatForm, ChatMessageList} from '../../../components'
import {ChatContextProvider} from '../../../context/chat.context'

const ChatRoom = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <ChatContextProvider>
      <h1>Chat room id: {id}</h1>
      <Chat>
        <ChatMessageList/>
        <ChatForm />
      </Chat>
    </ChatContextProvider>
  )
}

export default ChatRoom
