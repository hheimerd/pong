import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Htag } from "../../components";
import { useSnackBar } from "../../context/snackbar/snackbar.context";
import {
  ADD_MEMBER_TO_CHAT_MUTATION,
  CHATS_QUERY,
  PROFILE_QUERY,
  UPDATE_CHAT_MUTATION,
} from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";
import { IChatPunishment } from "../../interfaces/punishments.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Channel = (): JSX.Element => {
  const { updateSnackBarMessage } = useSnackBar();
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

  const [addToChat, { data: dataA, loading: loadingA, error: errorA }] =
    useMutation(ADD_MEMBER_TO_CHAT_MUTATION, {
      refetchQueries: [{ query: CHATS_QUERY }],
      onError(err) {
        console.log(err);
        updateSnackBarMessage(err.message);
      },
    });

  // wait while data loading
  if (loading || loadingU || loadingC)
    return <p>Loading user profile from graphql...</p>;
  if (error || errorC) return <p>Error: can't fetching data from graphql :(</p>;

  const current_user_id = data.getProfile.id;

  // filter chats only with ChatType == Channel
  const channels = dataC.chats.filter(
    (x: IChat) => x.type === ChatType.Channel
  );
  // console.log("channels", channels);
  // filter chats only with ChatType == Channel
  const private_channels = data.getProfile.chats
    .filter((x: IChat) => x.type === ChatType.Channel)
    .filter((x: IChat) => x.is_private === true);
  console.log("private_channels", private_channels);

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
      console.log("password", pass);
      addToChat({
        variables: {
          addMemberToChatChatId: channel.id,
          addMemberToChatPassword: pass,
        },
      });
    } else {
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
    }
  };

  const handleEdit = (channel: IChat) => {
    // console.log("The Values that you wish to edit ", values);
    router.push("/channels/edit/" + channel.id);
  };

  const handleCreate = () => {
    router.push("/channels/edit/create");
  };

  const getButtons = (channel: IChat) => {
    const isBanned = channel.punishments
      .filter((x: IChatPunishment) => x.degree == "BAN")
      .filter((x: IChatPunishment) => x.toUserId === current_user_id).length;
    console.log("isBanned", isBanned);
    if (isBanned) {
      return <p>You are banned</p>;
    }
    // console.log("punishments", channel.punishments);
    const membersIdArr = channel.members.reduce((a, { id }) => {
      if (id) a.push(id);
      return a;
    }, []);
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

  const getTable = (channels: [IChat]) => {
    if (!channels.length) return;
    return (
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
    );
  };
  // if (!rows) return null;

  return (
    <InnerPageLayout>
      <Htag tag="h1">Channels</Htag>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Button appearance="primary" onClick={() => handleCreate()}>
          Add channel
        </Button>
      </div>
      <Htag tag="h2">Public</Htag>
      {!channels.length ? "No chats available" : ""}
      {getTable(channels)}
      <Htag tag="h2">Private</Htag>
      {!private_channels.length ? "No chats available" : ""}
      {getTable(private_channels)}
    </InnerPageLayout>
  );
};

export default Channel;
