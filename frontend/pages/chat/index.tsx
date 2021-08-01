import { useQuery } from "@apollo/client";
import React from "react";
import { AvatarButton, Htag } from "../../components";
import { CHATS_QUERY } from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";

const Chat = (): JSX.Element => {
  const { loading, error, data } = useQuery(CHATS_QUERY);
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const current_user_id = data.getProfile.id;
  // filter chats only with ChatType == Chat
  const chats = data.getProfile.chats.filter(
    (x: IChat) => x.type === ChatType.Chat
  );

  const Messages = (chats: [IChat]) => {
    if (typeof chats !== "undefined") {
      return Array.from(chats).map((onemessage: IChat, i: number) => {
        return (
          <React.Fragment key={i}>
            <AvatarButton
              user={onemessage.members.find((x) => x.id !== current_user_id)}
              link={"/chat/room/" + onemessage.id}
              appearance="offline"
            />
          </React.Fragment>
        );
      });
    }
    return undefined;
  };

  return (
    <>
      <div>
        <Htag tag="h1">Chats</Htag>
        {typeof Messages(chats) === "undefined" || chats.length === 0 ? (
          <p className="info-message">No chats available now :(</p>
        ) : (
          Messages(chats)
        )}
      </div>
    </>
  );
};

export default Chat;
