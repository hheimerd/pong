import { useQuery } from "@apollo/client";
import { io } from "socket.io-client";
import React from "react";
import { Button, Htag } from "../../components";
import { GET_MATCHMAKING_GAMES, PROFILE_QUERY } from "../../graphql/queries";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import router from "next/router";

const StartGame = (): JSX.Element => {
  // get my profile
  const {
    data: dataU,
    error: errorU,
    loading: loadingU,
  } = useQuery(PROFILE_QUERY, {
    onError(err) {
      console.log("startgame PROFILE_QUERY", err);
    },
  });
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
      router.push(`http://${process.env.HOST}/game/${gameId}/?player1=${dataU.getProfile.id}`);
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
      console.log(data.getMatchmakingGames[0]);
//      data.getMatchmakingGames[0].players.push(1);
      const gameId = data.getMatchmakingGames[0].id;
      const socket = io("ws://" + process.env.GAME_API_HOST, {
        extraHeaders: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      socket.emit('connectToGame', { id:gameId } );
      router.push(`http://${process.env.HOST}/game/${gameId}/?player2=${dataU.getProfile.id}`);
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
          <br/>

        <Htag tag="h2">Rules</Htag>
        <ul style={{ listStyle: "none" }}>
          <li>Press Start game</li>
          <li>Config your game</li>
          <li>Press SPACE button</li>
          <li>Press UP DOWN button to move your desk</li>
          <li>Collect bonus red balls</li>
          <li>Play game, have fun!</li>
        </ul>
        </div>
      </div>
    </InnerPageLayout>
  );
};

export default StartGame;
