import React from "react";
import {AvatarButton} from "../../components";
import {IChatMessage} from "../../interfaces/message.interface";

const Chat = (): JSX.Element => {
  // Change this function, when it will be possible to fetch data from API
  const fetchChatRoomsList = ():Array<IChatMessage> => {
    return ([
      {
        user_id: "1",
        user_name: "Marge",
        user_avatar: "/photo_avatar.png",
      },
      {
        user_id: "2",
        user_name: "Ivan Smirnov",
        user_avatar: "",
      },
    ]);
  };

  const Messages = Array.from(fetchChatRoomsList()).map((onemessage: IChatMessage, i: number) => {
    return (
      <React.Fragment key={i}>
        <AvatarButton 
          name={onemessage.user_name}
          image={onemessage.user_avatar}
          link={'/chat/room/' + onemessage.user_id}/>
      </React.Fragment>
    );
  });

  return (<>
    <div>
      {Messages}
    </div>
  </>);
};

export default Chat;
