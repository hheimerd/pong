import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { Avatar, Button, Htag } from "../../components";
import { USER_QUERY } from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import styles from "./users.module.css";

const UserProfile = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  // get user
  const { data, error, loading } = useQuery(USER_QUERY, {
    variables: { userId: +id },
  });

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const handleFriends = (values: IUserProfile) => {
    console.log("handleFriends", values);
  };

  const handleBlock = (values: IUserProfile) => {
    console.log("handleBlock", values);
  };

  const handleMessage = (values: IUserProfile) => {
    console.log("handleMessage", values);
  };

  return (
    <div>
      <Htag tag="h1">{data.user.name}</Htag>
      <div className={styles.container}>
        <div>
          <Avatar size="large" name={data.user.name} image={data.user.avatar} />
        </div>
        <div>
          Status: ?<br />
          Rank: ?<br />
          Wins: ?<br />
          Lose: ?<br />
        </div>
        <div>
          <Button appearance="ghost" onClick={() => handleFriends(data.user)}>
            Add to friends
          </Button>
          <br />
          <br />
          <Button appearance="ghost" onClick={() => handleBlock(data.user)}>
            Add to black list
          </Button>
          <br />
          <br />
          <Button appearance="ghost" onClick={() => handleMessage(data.user)}>
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
