import { useQuery } from "@apollo/client";
import React from "react";
import { AvatarButton, AvatarById, Htag } from "../../components";
import { AvatarButtonById } from "../../components/AvatarButtonById/AvatarButtonById";
import { PROFILE_QUERY } from "../../graphql";
import {
  IUserProfile,
  UserStatus,
} from "../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Users = (): JSX.Element => {
  // get my profile
  const { data, error, loading } = useQuery(PROFILE_QUERY, {
    onError(err) {
      console.log("friends PROFILE_QUERY", err);
    },
  });

  // wait while data loading
  if (loading) return <p>Loading data from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  // if (!rows) return null;
  console.log("data.friends", data.getProfile.friends);

  // generate list of chats
  const UsersList = (users: [IUserProfile]) => {
    if (typeof users !== "undefined") {
      return Array.from(users).map((user: IUserProfile) => {
        if (user.id != data.getProfile.id) {
          return (
            <React.Fragment key={user.id}>
              <AvatarButtonById
                user_id={user.id}
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
        <Htag tag="h1">Friends</Htag>
        {typeof UsersList(data.getProfile.friends) === "undefined" ||
        data.getProfile.friends.length === 0 ? (
          <p className="info-message">No friends</p>
        ) : (
          UsersList(data.getProfile.friends)
        )}
      </div>
    </InnerPageLayout>
  );
};

export default Users;
