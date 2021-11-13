import { useQuery } from "@apollo/client";
import React from "react";
import { Button, Htag } from "../../components";
import { GET_MATCHMAKING_GAMES } from "../../graphql/queries";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Users = (): JSX.Element => {
  // get my profile
  const { data, error, loading } = useQuery(GET_MATCHMAKING_GAMES);

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const handleMM = () => {
    if (data.getMatchmakingGames.length == 0) {
      // if match making game NOT found
      console.log("mathch making game NOT found");
      // create game here...
    } else {
      // if match making game found
      console.log("mathch making game FOUND");
    }
  };

  return (
    <InnerPageLayout>
      <div>
        <br />
        <Htag tag="h1">Play game</Htag>
        <div className="center">
          <br />
          <br />
          <Button appearance="primary" onClick={() => handleMM()}>
            START GAME
          </Button>
        </div>
      </div>
    </InnerPageLayout>
  );
};

export default Users;
