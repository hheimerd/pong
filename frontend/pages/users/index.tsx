import { useQuery } from "@apollo/client";
import React from "react";
import { AvatarButton, Htag } from "../../components";
import { PROFILE_QUERY, USERS_QUERY } from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Users = (): JSX.Element => {
  // get my profile
  const {
    data: dataProfile,
    error: errorProfile,
    loading: loadingProfile,
  } = useQuery(PROFILE_QUERY);

  const { loading, error, data } = useQuery(USERS_QUERY, {
    variables: {
      usersOffset: 0,
      usersLimit: 100,
    },
  });

  // wait while data loading
  if (loading || loadingProfile) return <p>Loading data from graphql...</p>;
  if (error || errorProfile)
    return <p>Error: can't fetching data from graphql :(</p>;

  // if (!rows) return null;

  // generate list of chats
  const UsersList = (users: [IUserProfile]) => {
    if (typeof users !== "undefined") {
      return Array.from(users).map((user: IUserProfile, i: number) => {
        if (user.id != dataProfile.getProfile.id) {
          return (
            <React.Fragment key={i}>
              <AvatarButton
                user={user}
                link={"/users/" + user.id}
                appearance={user.status}
              />
            </React.Fragment>
          );
        }
      });
    }
    return undefined;
  };

  return (
    <InnerPageLayout>
      <div>
        <Htag tag="h1">All users</Htag>
        {typeof UsersList(data.users) === "undefined" ||
        data.users.length === 0 ? (
          <p className="info-message">No chats available now :(</p>
        ) : (
          UsersList(data.users)
        )}
      </div>
    </InnerPageLayout>
  );
};

export default Users;
