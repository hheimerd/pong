import { useQuery } from "@apollo/client";
import React from "react";
import { Htag, LeaderboardItem } from "../../components";
import { PROFILE_QUERY } from "../../graphql";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import styles from "./leaderboard.module.css";

const Leaderboard = (): JSX.Element => {
  // get my profile
  const { data, error, loading } = useQuery(PROFILE_QUERY);

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  return (
    <InnerPageLayout>
      <Htag tag="h1">Leaderboard</Htag>
      <div className={styles.container}>
        <LeaderboardItem
          name={data.getProfile.name}
          image={data.getProfile.avatar}
          position={1}
          scoreLeft={7}
          scoreRight={10}
        />
        <LeaderboardItem
          name={data.getProfile.name}
          image={data.getProfile.avatar}
          position={2}
          scoreLeft={7}
          scoreRight={10}
        />
        <LeaderboardItem
          name={data.getProfile.name}
          image={data.getProfile.avatar}
          position={3}
          scoreLeft={7}
          scoreRight={10}
        />
      </div>
    </InnerPageLayout>
  );
};

export default Leaderboard;
