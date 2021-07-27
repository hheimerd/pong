import React from "react";
import {AvatarButton, Htag} from "../../components";
import {IChat} from "../../interfaces/chat.interface";

const Chat = (): JSX.Element => {
  // Change this function, when it will be possible to fetch data from API
  const fetchChatRoomsList = ():Array<IChat> => {
    return ([
      {
        id: "1",
        users: [
          {
            id: "1",
            name: "Marge",
            avatar: { sm: "/photo_avatar.png" }
          }
        ]
      },
      {
        id: "2",
        users: [
          {
            id: "1",
            name: "Sergey Ivanov",
          }
        ]
      },
    ]);
  };

  const Messages = Array.from(fetchChatRoomsList()).map((onemessage: IChat, i: number) => {
    return (
      <React.Fragment key={i}>
        <AvatarButton 
          user={onemessage.users[0]}
          link={'/chat/room/' + onemessage.id}
          appearance='offline'
        />
      </React.Fragment>
    );
  });

  return (<>
    <div>
      <Htag tag='h1'>Chats</Htag>
      {Messages}
    </div>
  </>);
};

export default Chat;
