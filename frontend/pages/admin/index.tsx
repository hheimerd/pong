import { useMutation, useQuery } from "@apollo/client";
import format from "date-fns/format";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button, Htag } from "../../components";
import { DELETE_USER_MUTATION, USERS_QUERY } from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";

const Channel = (): JSX.Element => {
  const router = useRouter();
  const { loading, error, data } = useQuery(USERS_QUERY, {
    variables: {
      usersOffset: 0,
      usersLimit: 100,
    },
  });

  const [
    deleteUser,
    {
      data: dataDeleteUser,
      loading: loadingDeleteUser,
      error: errorDeleteUser,
    },
  ] = useMutation(DELETE_USER_MUTATION, {
    refetchQueries: [
      {
        query: USERS_QUERY,
        variables: {
          usersOffset: 0,
          usersLimit: 100,
        },
      },
    ],
    onError(err) {
      console.log(err);
    },
  });

  // wait while data loading
  if (loading) return <p>Loading data from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  // leave Channel
  const handleDelete = (values: IUserProfile) => {
    // console.log("The Values that you wish to delete ", values);
    deleteUser({
      variables: {
        removeUserId: values.id,
      },
    });
  };

  // edit Channel
  const handleEdit = (values: IUserProfile) => {
    console.log("The Values that you wish to edit ", values);
    router.push("/admin/edit/" + values.id);
  };

  // create Channel
  const handleCreate = () => {
    router.push("/admin/edit/create");
  };

  // if (!rows) return null;

  return (
    <>
      <Htag tag="h1">Users</Htag>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Button appearance="primary" onClick={() => handleCreate()}>
          Add user
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Login</td>
            <td>Email</td>
            <td>Created</td>
            <td>Updated</td>
            <td>Avatar</td>
            <td>Roles</td>
            <td align="right"></td>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user: IUserProfile) => (
            <tr key={user.login}>
              <td>{user.id}</td>
              <td>
                <Link href={"/users/" + user.id}>{user.name}</Link>
              </td>
              <td>{user.login}</td>
              <td>{user.email}</td>
              <td>{format(new Date(user.created_at), "dd MMM yyyy H:mm")}</td>
              <td>{format(new Date(user.updated_at), "dd MMM yyyy H:mm")}</td>
              <td>{user.avatar}</td>
              <td>{user.roles}</td>
              <td align="right">
                <Button appearance="ghost" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button appearance="ghost" onClick={() => handleDelete(user)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Channel;
