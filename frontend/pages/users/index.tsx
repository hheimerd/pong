import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { AvatarButton, Button, Htag } from "../../components";
import {
  CHATS_QUERY,
  CREATE_CHAT_MUTATION,
  PROFILE_QUERY,
  USERS_QUERY,
} from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";

const Users = (): JSX.Element => {
  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(PROFILE_QUERY);

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
  ] = useMutation(CREATE_CHAT_MUTATION, {
    refetchQueries: [
      {
        query: CHATS_QUERY,
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
  if (loading || loadingUser) return <p>Loading data from graphql...</p>;
  if (error || errorUser)
    return <p>Error: can't fetching data from graphql :(</p>;

  // if (!rows) return null;

  // generate list of chats
  const UsersList = (users: [IUserProfile]) => {
    if (typeof users !== "undefined") {
      return Array.from(users).map((user: IUserProfile, i: number) => {
        return (
          <React.Fragment key={i}>
            <AvatarButton
              user={user}
              link={"/users/" + user.id}
              image={user.avatar}
              appearance="offline"
            />
          </React.Fragment>
        );
      });
    }
    return undefined;
  };

  return (
    <>
      <div>
        <Htag tag="h1">All users</Htag>
        {typeof UsersList(data.users) === "undefined" ||
        data.users.length === 0 ? (
          <p className="info-message">No chats available now :(</p>
        ) : (
          UsersList(data.users)
        )}
      </div>
    </>
  );
};

export default Users;
