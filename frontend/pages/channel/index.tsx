import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {Htag} from "../../components";
import {useRouter} from "next/router";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  a: {
    color: "red"
  }
});

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
  const classes = useStyles();
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
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Users count</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <a href={"/channel/room/" + row.id} className={classes.a}>{row.name}</a>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.users_count}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell align="right">
                  { row.role === "owner" 
                    ? <Button aria-label="edit" onClick={() => handleEdit(row)}>Edit</Button>
                    : null
                  }
                  <Button aria-label="leave" onClick={() => handleLeave(row)}>
                    Leave
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Channel;
