import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { Button, Htag } from "../../components";
import { CHATS_QUERY } from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";

const Channel = (): JSX.Element => {
  const router = useRouter();
  const { loading, error, data } = useQuery(CHATS_QUERY);

  // wait while data loading
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const current_user_id = data.getProfile.id;

  // filter chats only with ChatType == Channel
  const channels = data.getProfile.chats.filter(
    (x: IChat) => x.type === ChatType.Channel
  );

  // leave Channel
  const handleLeave = (values: IChat) => {
    console.log("The Values that you wish to leave ", values);
  };

  // edit Channel
  const handleEdit = (values: IChat) => {
    console.log("The Values that you wish to edit ", values);
    router.push("/channels/edit/" + values.id);
  };

  // create Channel
  const handleCreate = () => {
    router.push("/channels/edit/create");
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
            <td>Owner</td>
            <td align="right"></td>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel: IChat) => (
            <tr key={channel.name}>
              <td>
                <a href={"/channels/room/" + channel.id}>{channel.name}</a>
              </td>
              <td>{channel.is_private ? "Private" : "Public"}</td>
              <td>{channel.members.length}</td>
              <td>{channel.owner.name}</td>
              <td align="right">
                {channel.owner.id === current_user_id ? (
                  <Button
                    appearance="ghost"
                    onClick={() => handleEdit(channel)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    appearance="ghost"
                    onClick={() => handleLeave(channel)}
                  >
                    Leave
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Channel;
