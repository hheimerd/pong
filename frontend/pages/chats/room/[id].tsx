import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  ChannelUserChip,
  Chat,
  ChatForm,
  ChatMessageList,
  Htag,
} from "../../../components";
import { ChatContextProvider } from "../../../context/chat/chat.context";
import { MY_CHATS_QUERY } from "../../../graphql/queries";
import { IChat } from "../../../interfaces/chat.interface";
import { IUserProfile } from "../../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../../layout/InnerPageLayout";

const ChatRoom = (): JSX.Element => {
  const { loading, error, data } = useQuery(MY_CHATS_QUERY);
  const router = useRouter();
  const { id } = router.query;

  // get friend name from current chat
  const getFriendName = () => {
    return chats[0].members.filter(
      (x: IUserProfile) => x.id !== current_user_id
    )[0].name;
  };

  // on loading
  useEffect(() => {
    if (!loading) document.title = "Chat: " + getFriendName();
  }, [loading]);

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;
  if (typeof id !== "string") return null;

  const current_user_id = data.getProfile.id;

  // filter chats only with ChatType == Chat
  const chats = data.getProfile.chats.filter((x: IChat) => x.id === id);
  // console.log(chats);

  return (
    <InnerPageLayout>
      <ChatContextProvider>
        <Htag tag="h1">Chat: {getFriendName()}</Htag>
        {chats[0].members.map((user: IUserProfile) => (
          <ChannelUserChip
            user={user}
            current_user_id={data.getProfile.id}
            current_channel={chats[0]}
          />
        ))}
        <br />
        <br />
        <Chat>
          <ChatMessageList id={id} current_user_id={data.getProfile.id} />
          <ChatForm id={id} />
        </Chat>
      </ChatContextProvider>
    </InnerPageLayout>
  );
};

export default ChatRoom;
