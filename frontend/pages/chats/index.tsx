import { useQuery } from "@apollo/client";
import React from "react";
import { AvatarButton, Htag } from "../../components";
import { MY_CHATS_QUERY } from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Chat = (): JSX.Element => {
  const { loading, error, data } = useQuery(MY_CHATS_QUERY, {
    onError(err) {
      console.log("chats room MY_CHATS_QUERY", err);
    },
  });

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const current_user_id = data.getProfile.id;

  // filter chats only with ChatType == Chat
  const chats = data.getProfile.chats.filter(
    (x: IChat) => x.type === ChatType.Chat
  );

  // generate list of chats
  const ChatList = (chats: [IChat]) => {
    if (typeof chats !== "undefined") {
      return Array.from(chats).map((onemessage: IChat, i: number) => {
        const user = onemessage.members.find((x) => x.id !== current_user_id);
        return (
          <React.Fragment key={i}>
            <AvatarButton
              user={user}
              link={"/chats/room/" + onemessage.id}
              appearance={user.status}
            />
          </React.Fragment>
        );
      });
    }
    return undefined;
  };

  return (
    <InnerPageLayout>
      <div>
        <Htag tag="h1">Chats</Htag>
        {typeof ChatList(chats) === "undefined" || chats.length === 0 ? (
          <p className="info-message">No chats available now :(</p>
        ) : (
          ChatList(chats)
        )}
      </div>
    </InnerPageLayout>
  );
};

export default Chat;
