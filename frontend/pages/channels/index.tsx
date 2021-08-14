import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Htag } from "../../components";
import {
  CHATS_QUERY,
  PROFILE_QUERY,
  UPDATE_CHAT_MUTATION,
} from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";

const Channel = (): JSX.Element => {
  const router = useRouter();
  const { loading, error, data } = useQuery(PROFILE_QUERY);
  const {
    loading: loadingC,
    error: errorC,
    data: dataC,
  } = useQuery(CHATS_QUERY);
  const [updateChat, { data: dataU, loading: loadingU }] = useMutation(
    UPDATE_CHAT_MUTATION,
    {
      refetchQueries: [{ query: CHATS_QUERY }],
      onError(err) {
        console.log(err);
      },
    }
  );

  // wait while data loading
  if (loading || loadingU || loadingC)
    return <p>Loading user profile from graphql...</p>;
  if (error || errorC) return <p>Error: can't fetching data from graphql :(</p>;

  const current_user_id = data.getProfile.id;

  // filter chats only with ChatType == Channel
  const channels = dataC.chats.filter(
    (x: IChat) => x.type === ChatType.Channel
  );
  console.log("channels", channels);

  const handleLeave = (channel: IChat, membersIdArr: Array<number>) => {
    membersIdArr = membersIdArr.filter((n) => n != current_user_id);
    console.log("values", membersIdArr);
    updateChat({
      variables: {
        updateChatInput: {
          id: channel.id,
          members: membersIdArr,
        },
      },
    });
  };

  const handleJoin = (channel: IChat, membersIdArr: Array<number>) => {
    if (channel.hasPassword) {
      const pass = prompt("Please enter password for channel " + channel.name);
      if (pass != channel.password) return;
    }
    membersIdArr.push(current_user_id);
    console.log("values", membersIdArr);
    updateChat({
      variables: {
        updateChatInput: {
          id: channel.id,
          members: membersIdArr,
        },
      },
    });
  };

  const handleEdit = (channel: IChat) => {
    // console.log("The Values that you wish to edit ", values);
    router.push("/channels/edit/" + channel.id);
  };

  const handleCreate = () => {
    router.push("/channels/edit/create");
  };

  const getButtons = (channel: IChat) => {
    const membersIdArr = channel.members.reduce((a, { id }) => {
      if (id) a.push(id);
      return a;
    }, []);
    // console.log("values", membersIdArr);
    if (channel.ownerId && channel.ownerId === current_user_id) {
      return (
        <Button appearance="primary" onClick={() => handleEdit(channel)}>
          Edit
        </Button>
      );
    } else {
      if (
        membersIdArr.includes(current_user_id) &&
        channel.members.length > 2
      ) {
        return (
          <Button
            appearance="primary"
            onClick={() => handleLeave(channel, membersIdArr)}
          >
            Leave
          </Button>
        );
      }

      if (!membersIdArr.includes(current_user_id)) {
        return (
          <Button
            appearance="ghost"
            onClick={() => handleJoin(channel, membersIdArr)}
          >
            {membersIdArr.includes(current_user_id)}
            Join
          </Button>
        );
      }
    }
  };

  const getLink = (channel: IChat) => {
    const membersIdArr = channel.members.reduce((a, { id }) => {
      if (id) a.push(id);
      return a;
    }, []);
    if (!membersIdArr.includes(current_user_id)) return <>{channel.name}</>;
    return <Link href={"/channels/room/" + channel.id}>{channel.name}</Link>;
  };

  // if (!rows) return null;

  return (
    <>
      <Htag tag="h1">Channels</Htag>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Button appearance="primary" onClick={() => handleCreate()}>
          Add channel
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Users count</td>
            {/* <td>Owner</td> */}
            <td align="right"></td>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel: IChat) => (
            <tr key={channel.name}>
              <td>{getLink(channel)}</td>
              <td>
                {channel.is_private ? "Private" : "Public"}
                {channel.hasPassword ? " (Protected)" : ""}
              </td>
              <td>{channel.members.length}</td>
              {/*<td>{channel.owner ? channel.owner.name : ""}</td>*/}
              <td align="right">{getButtons(channel)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Channel;
