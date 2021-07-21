import React from "react";
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

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  a: {
    color: "red"
  }
});

interface Row {
  name: string,
  type: string,
  users_count: number,
  owner: string
}

const createData = (
  name: string,
  type: string,
  users_count: number,
  owner: string): Row => {
  return { name, type, users_count, owner };
};

const rows: Array<Row> = [
  createData("Frozen yoghurt", "Private", 6, "Andrey"),
  createData("Ice cream sandwich", "Private", 9, "Sergey"),
  createData("Eclair", "Public", 16, "Alexandr"),
  createData("Cupcake", "Public", 3, "Mihail"),
  createData("Gingerbread", "Protected", 16, "Stepan")
];

const Channel = (): JSX.Element => {
  const classes = useStyles();

  const handleLeave = (values: Row) => {
    console.log("The Values that you wish to leave ", values);
  };

  const handleEdit = (values: Row) => {
    console.log("The Values that you wish to edit ", values);
  };

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
                  <a href="#" className={classes.a}>{row.name}</a>
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.users_count}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell align="right">
                  <Button aria-label="leave" onClick={() => handleLeave(row)}>
                    Leave
                  </Button>
                  <Button aria-label="edit" onClick={() => handleEdit(row)}>
                    Edit
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
