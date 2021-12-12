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
import useChannelById from "../../../hooks/useChannelById";
import { IChat } from "../../../interfaces/chat.interface";
import { IUserProfile } from "../../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../../layout/InnerPageLayout";

const ChannelRoom = (): JSX.Element => {
  const { loading, error, data } = useQuery(MY_CHATS_QUERY, {
    onError(err) {
      console.log("channel room MY_CHATS_QUERY", err);
    },
  });
  const router = useRouter();
  const { id } = router.query;
  console.log("channel id", id);
  
  const channel = useChannelById(id);

  // get current channel from current user profile
  const getChannel = (): IChat => {
    const channel = data.getProfile.chats.filter((x: IChat) => x.id === id)[0];
    return channel;
  };

  // on loading
  useEffect(() => {
    if (!loading && typeof channel !== "undefined") {
      document.title = "Channel: " + channel.name;
    }
  }, [loading]);

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error || !channel) return <p>Error: can't fetching data from graphql :(</p>;
  // if (typeof getChannel() === "undefined") router.push("/channels");
  // console.log("channel", channel.id);

  // check slug type
  if (typeof id !== "string") return null;
  if (typeof data === "undefined") return null;

  return (
    <InnerPageLayout>
      <ChatContextProvider>
        <Htag tag="h1">{channel.name}</Htag>
        {channel.members.map((user: IUserProfile) => (
          <ChannelUserChip
            key={user.id}
            user={user}
            current_user_id={data.getProfile.id}
            current_channel={channel}
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

export default ChannelRoom;
