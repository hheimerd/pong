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
import { MY_CHATS_QUERY } from "../../../graphql";
import { IChat } from "../../../interfaces/chat.interface";
import { IUserProfile } from "../../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../../layout/InnerPageLayout";

const ChannelRoom = (): JSX.Element => {
  const { loading, error, data } = useQuery(MY_CHATS_QUERY);
  const router = useRouter();
  const { id } = router.query;

  // get current channel from current user profile
  const getChannel = (): IChat => {
    const channel = data.getProfile.chats.filter((x: IChat) => x.id === id)[0];
    return channel;
  };

  // on loading
  useEffect(() => {
    if (!loading && typeof data !== "undefined") {
      document.title = "Channel: " + getChannel().name;
    }
  }, [loading]);

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  // check slug type
  if (typeof id !== "string") return null;
  if (typeof data === "undefined") return null;

  return (
    <InnerPageLayout>
      <ChatContextProvider>
        <Htag tag="h1">{getChannel().name}</Htag>
        {getChannel().members.map((user: IUserProfile) => (
          <ChannelUserChip
            user={user}
            current_user_id={data.getProfile.id}
            current_channel={getChannel()}
          />
        ))}
        <br />
        <br />
        <Chat>
          <ChatMessageList id={id} />
          <ChatForm id={id} />
        </Chat>
      </ChatContextProvider>
    </InnerPageLayout>
  );
};

export default ChannelRoom;
