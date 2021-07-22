import React, {useEffect, useState} from "react";
import {Button, Htag} from "../../components";
import {useRouter} from "next/router";

interface Row {
  id: number,
  name: string,
  type: string,
  users_count: number,
  owner: string
  role: string
}

const createData = (
  id: number,
  name: string,
  type: string,
  users_count: number,
  owner: string,
  role: string
): Row => {
  return { id, name, type, users_count, owner, role };
};

const fetchChannels = (): Array<Row> => {
  const rows: Array<Row> = [
    createData(1, "Frozen yoghurt", "Private", 6, "me", "owner"),
    createData(2, "Ice cream sandwich", "Private", 9, "me", "owner"),
    createData(3, "Eclair", "Public", 16, "Alexandr", "user"),
    createData(4, "Cupcake", "Public", 3, "Mihail", "user"),
    createData(5, "Gingerbread", "Protected", 16, "Stepan", "admin")
  ];
  return rows;
};

const Channel = (): JSX.Element => {
  const router = useRouter();
  const [rows, setRows] = useState<Array<Row>>();

  useEffect(() => {
    setRows(fetchChannels());
  }, []);

  const handleLeave = (values: Row) => {
    console.log("The Values that you wish to leave ", values);
  };

  const handleEdit = (values: Row) => {
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
          {rows.map(row => (
            <tr key={row.name}>
              <td>
                <a href={"/channel/room/" + row.id}>{row.name}</a>
              </td>
              <td>{row.type}</td>
              <td>{row.users_count}</td>
              <td>{row.owner}</td>
              <td align="right">
                { row.role === "owner" 
                  ? <Button appearance="ghost" onClick={() => handleEdit(row)}>Edit</Button>
                  : null
                }
                <Button appearance="ghost" onClick={() => handleLeave(row)}> Leave </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Channel;
