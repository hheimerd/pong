import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { AvatarButton, Button, Htag, MatchHistory } from "../../components";
import { MatchHistoryOnePlayer } from "../../components/MatchHistoryOnePlayer/MatchHistoryOnePlayer";
import { PROFILE_QUERY } from "../../graphql";
import { GET_ALL_GAMES } from "../../graphql/queries";
import { IGameResult } from "../../interfaces/gameresult.interface";
import {
  IUserProfile,
  UserStatus,
} from "../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const ActiveGames = (): JSX.Element => {
  // Get my profile.
  const { data, error, loading } = useQuery(PROFILE_QUERY, {
    onError(err) {
      console.log("ActiveGames PROFILE_QUERY", err);
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof data !== "undefined") {
      console.log("data.friends", data.getProfile.friends);
    }
  }, [data]);

  // get my profile
  const {
    loading: loadingG,
    error: errorG,
    data: dataG,
  } = useQuery(GET_ALL_GAMES, {
    variables: {
      fetchPolicy: "cache-and-network",
    },
    onError(err) {
      console.log("GET_ALL_GAMES", err);
    },
  });

  // wait while data loading
  if (loading || loadingG) return <p>Loading data from graphql...</p>;
  if (error || errorG)
    return <p>Error: can't fetching data from graphql :( {}</p>;

  // if (!rows) return null;

  // generate list of games
  const GameList = (games: [IGameResult]) => {
    if (typeof games !== "undefined") {
      return Array.from(games).map((onegame: IGameResult, i: number) => {
        console.log("onegame ", onegame);
        return (
          <React.Fragment key={i}>
            {onegame.players.length == 2 ? (
              <MatchHistory
                users={[+onegame.players[0], +onegame.players[1]]}
                href={"/game/" + onegame.id + "/?spectator=true"}
              />
            ) : (
              ""
            )}
            {onegame.players.length == 1 ? (
              <MatchHistoryOnePlayer
                users={[+onegame.players[0]]}
                href={"/game/" + onegame.id + "/?spectator=true"}
              />
            ) : (
              ""
            )}
          </React.Fragment>
        );
      });
    }
    return undefined;
  };

  const handleRefresh = () => {
    router.replace(router.asPath);
  };

  // Wait while data loading.
  if (loading) return <p>Loading data from graphql...</p>;

  // Get error from graphql request.
  if (error) {
    // Remove old token if error happened and token found.
    if (localStorage.getItem("token") !== "") {
      localStorage.clear();
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

  // Generate list of chats.
  const UsersList = (users: [IUserProfile]) => {
    if (typeof users !== "undefined") {
      return Array.from(users).map((user: IUserProfile, i: number) => {
        if (user.id != data.getProfile.id) {
          return (
            <React.Fragment key={i}>
              <AvatarButton
                user={user}
                link={"/users/" + user.id}
                appearance={UserStatus.Undefined}
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
      <Htag tag="h1">Active games</Htag>
      <div className="center">
        <Button appearance="ghost" onClick={() => handleRefresh()}>
          Refresh
        </Button>
      </div>
      <br />
      {typeof GameList(dataG.getAllGames) === "undefined" ||
      dataG.getAllGames.length === 0 ? (
        <p className="info-message">No chats available now :(</p>
      ) : (
        GameList(dataG.getAllGames)
      )}
    </InnerPageLayout>
  );
};

export default ActiveGames;
