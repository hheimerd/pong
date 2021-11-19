import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AvatarById, Button, Htag } from "../../components";
import { useSnackBar } from "../../context/snackbar/snackbar.context";
import {
  ADD_MEMBER_TO_CHAT_MUTATION,
  CHATS_QUERY,
  DELETE_CHAT_MUTATION,
  PROFILE_QUERY,
  UPDATE_CHAT_MUTATION,
} from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";
import { IChatPunishment } from "../../interfaces/punishments.interface";
import { IUserProfile } from "../../interfaces/userprofile.interface";
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
      refetchQueries: [{ query: CHATS_QUERY }, { query: PROFILE_QUERY }],
      onError(err) {
        console.log(err);
      },
    }
  );

  const [addToChat, { loading: loadingA, error: errorA }] = useMutation(
    ADD_MEMBER_TO_CHAT_MUTATION,
    {
      refetchQueries: [{ query: CHATS_QUERY }],
      onError(err) {
        console.log(err);
        updateSnackBarMessage(err.message);
      },
    }
  );

  const [deleteChat, { loading: loadingD, error: errorD }] = useMutation(
    DELETE_CHAT_MUTATION,
    {
      refetchQueries: [{ query: CHATS_QUERY }],
      onError(err) {
        console.log(err);
        updateSnackBarMessage(err.message);
      },
    }
  );

  // wait while data loading
  if (loading || loadingA || loadingU || loadingC || loadingD)
    return <p>Loading from graphql...</p>;
  if (error || errorC || errorA || errorD)
    return <p>Error: can't fetching data from graphql :(</p>;

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
    router.push("/channels/edit/" + channel.id);
  };

  const handleCreate = () => {
    router.push("/channels/edit/create");
  };

  const handleDelete = (channel: IChat) => {
    deleteChat({
      variables: {
        removeChatId: channel.id,
      },
    });
  };

  const isCurrentUserAdmin = (user: IUserProfile) => {
    const curUserRoles = user.roles;
    if (curUserRoles.length != 0 && curUserRoles.includes("Admin")) {
      return true;
    }
    return false;
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

    const buttonArr = [];

    if (channel.ownerId && channel.ownerId === current_user_id) {
      buttonArr.push(
        <Button appearance="primary" onClick={() => handleEdit(channel)}>
          Edit
        </Button>
      );
    } else {
      if (
        membersIdArr.includes(current_user_id) &&
        channel.members.length > 2
      ) {
        buttonArr.push(
          <Button
            appearance="primary"
            onClick={() => handleLeave(channel, membersIdArr)}
          >
            Leave
          </Button>
        );
      }

      if (!membersIdArr.includes(current_user_id)) {
        buttonArr.push(
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
    if (isCurrentUserAdmin(data.getProfile)) {
      buttonArr.push(
        <>
          &nbsp;
          <Button appearance="primary" onClick={() => handleDelete(channel)}>
            Delete
          </Button>
        </>
      );
    }
    return buttonArr;
  };

  const getLink = (channel: IChat) => {
    const membersIdArr = channel.members.reduce((a, { id }) => {
      if (id) a.push(id);
      return a;
    }, []);
    if (
      !membersIdArr.includes(current_user_id) &&
      !isCurrentUserAdmin(data.getProfile)
    )
      return <>{channel.name}</>;
    return <Link href={"/channels/room/" + channel.id}>{channel.name}</Link>;
  };

  const getTable = (channels: [IChat]) => {
    if (!channels.length) return;
    return (
      <table className="chat_list_table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Type</td>
            <td>Users count</td>
            <td>Owner</td>
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
              <td>
                <AvatarById user_id={+channel.ownerId} size="xxsmall" />
              </td>
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
