import React, {useEffect, useState} from "react";
import {Button, Htag} from "../../components";
import {useRouter} from "next/router";
import {ChatType, IChat} from "../../interfaces/chat.interface";

const fetchChatArray = ():Array<IChat> => {
  return ([
    {
      id: "1",
      name: "First channel",
      type: ChatType.Channel,
      owner: {
        id: "1",
      },
      users: [
        {
          id: "1",
          name: "Marge",
          avatar: { sm: "/photo_avatar.png" }
        },
        {
          id: "2",
          name: "Sergey Ivanov",
        }
      ],
      is_private: false,
    },
    {
      id: "2",
      name: "Second private channel",
      type: ChatType.Channel,
      owner: {
        id: "2",
      },
      users: [
        {
          id: "1",
          name: "Marge",
          avatar: { sm: "/photo_avatar.png" }
        },
        {
          id: "2",
          name: "Sergey Ivanov",
        },
        {
          id: "3",
          name: "Ivan Ivanov",
        }
      ],
      is_private: true,
      password: "123"
    },
  ]);
};

const Channel = (): JSX.Element => {
  const router = useRouter();
  const [rows, setRows] = useState<Array<IChat>>();

  useEffect(() => {
    setRows(fetchChatArray());
  }, []);

  const handleLeave = (values: IChat) => {
    console.log("The Values that you wish to leave ", values);
  };

  const handleEdit = (values: IChat) => {
    console.log("The Values that you wish to edit ", values);
    router.push('/channel/edit/' + values.id);
  };

  if (!rows) return null;

  return (
    <>
      <Htag tag='h1'>Channels</Htag>
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
          {rows.map(channel => (
            <tr key={channel.name}>
              <td>
                <a href={"/channel/room/" + channel.id}>{channel.name}</a>
              </td>
              <td>{channel.is_private ? "Private" : "Public"}</td>
              <td>{channel.users.length}</td>
              <td>{channel.owner.name}</td>
              <td align="right">
                { /* change 1 to this user profile id */ }
                { channel.owner.id === "1"
                  ? <Button appearance="ghost" onClick={() => handleEdit(channel)}>Edit</Button>
                  : null
                }
                <Button appearance="ghost" onClick={() => handleLeave(channel)}> Leave </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Channel;
