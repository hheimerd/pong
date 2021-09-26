import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AvatarButton, Htag } from "../../components";
import { PROFILE_QUERY } from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import styles from "./dashboard.module.css";

const Users = (): JSX.Element => {
  // get my profile
  const { data, error, loading } = useQuery(PROFILE_QUERY);
  const router = useRouter();

  // wait while data loading
  if (loading) return <p>Loading data from graphql...</p>;
  if (error) {
    // remove old token if error happened and token found
    if (localStorage.getItem("token") !== "") {
      localStorage.removeItem("token");
      router.push("/");
    }
    return (
      <>
        <p className="error-message">
          Error: can't fetching data from graphql :(
          <br />
          {error.message}
        </p>
        <p>
          <Link href="/">Return to home page</Link>
        </p>
      </>
    );
  }

  // if (!rows) return null;
  console.log("data.friends", data.getProfile.friends);

  // generate list of chats
  const UsersList = (users: [IUserProfile]) => {
    if (typeof users !== "undefined") {
      return Array.from(users).map((user: IUserProfile, i: number) => {
        if (user.id != data.getProfile.id) {
          return (
            <React.Fragment key={i}>
              <AvatarButton
                user={user}
                link={"/users/" + user.id}
                appearance="offline"
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
      <div className={styles.grid}>
        <div>
          <Htag tag="h2">Match history</Htag>
        </div>
        <div>
          <Htag tag="h2">Friends</Htag>
          {typeof UsersList(data.getProfile.friends) === "undefined" ||
          data.getProfile.friends.length === 0 ? (
            <p className="info-message">No friends</p>
          ) : (
            UsersList(data.getProfile.friends)
          )}
        </div>
      </div>
    </InnerPageLayout>
  );
};

export default Users;
