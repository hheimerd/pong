import React from "react";
import {AvatarButton} from "../../components";

const Chat = () => {
    return (<>
      <div>
        <AvatarButton image="" link="/chat/room/1" name="Ivan"/>
        <AvatarButton image="photo_avatar.png" link="/chat/room/2" name="Marge"/>
      </div>
    </>);
}

export default Chat
