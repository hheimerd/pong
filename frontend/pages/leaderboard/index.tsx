import { useQuery } from "@apollo/client";
import React from "react";
import { Htag, LeaderboardItem } from "../../components";
import { GET_LEADER_BOARD } from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import styles from "./leaderboard.module.css";

const Leaderboard = (): JSX.Element => {
  // get my profile
  const { data, error, loading } = useQuery(GET_LEADER_BOARD, {
    variables: {
      fetchPolicy: "cache-and-network",
    },
  });

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const Leaderboard = Array.from(data.getLeaderBoard).map(
    (user: IUserProfile, i: number) => {
      return (
        <React.Fragment key={i}>
          <LeaderboardItem
            name={user.name}
            image={user.avatar}
            position={user.rank}
          />
        </React.Fragment>
      );
    }
  );

  return (
    <InnerPageLayout>
      <Htag tag="h1">Leaderboard</Htag>
      <div className={styles.container}>{Leaderboard}</div>
    </InnerPageLayout>
  );
};

export default Leaderboard;
