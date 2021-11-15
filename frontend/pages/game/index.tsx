import { useQuery } from "@apollo/client";
import { io } from "socket.io-client";
import React from "react";
import { Button, Htag } from "../../components";
import { GET_MATCHMAKING_GAMES, PROFILE_QUERY } from "../../graphql/queries";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import router from "next/router";

const Users = (): JSX.Element => {
  // get my profile
  const {
    data: dataU,
    error: errorU,
    loading: loadingU,
  } = useQuery(PROFILE_QUERY);
  const { data, error, loading } = useQuery(GET_MATCHMAKING_GAMES);

  // wait fetching data
  if (loading || loadingU) return <p>Loading user profile from graphql...</p>;
  if (error || errorU) return <p>Error: can't fetching data from graphql :(</p>;

  async function createGame(socket, user: IUserProfile): Promise<number> {
    return new Promise((resolve, reject) => {
      socket.on("gameCreated", (o) => {
        const id = o?.game?.id;
        if (id !== undefined) {
          resolve(id);
        } else {
          reject(o);
        }
      });
      socket.emit("createGame", { name: `${user.login}_matchmaking_game` });
    });
  }

  const handleCreateGame = async (user: IUserProfile) => {
    const socket = io("ws://" + process.env.GAME_API_HOST, {
      extraHeaders: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    try {
      const gameId = await createGame(socket, user);
      console.log(`Game ${gameId} created`);
      // redirect to game URL
      router.push(`http://${process.env.HOST}/game/${gameId}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMM = () => {
    if (data.getMatchmakingGames.length == 0) {
      // if match making game NOT found
      console.log("mathch making game NOT found, will create new game...");
      handleCreateGame(dataU.getProfile);
    } else {
      // if match making game found
      console.log("mathch making game FOUND");
      const gameId = data.getMatchmakingGames[0].id;
      router.push(`http://${process.env.HOST}/game/${gameId}`);
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
