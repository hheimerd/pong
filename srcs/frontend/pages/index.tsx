import Router, { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Button } from "../components";
import { PersonalTokenContext } from "../context/personaltoken/personaltoken.context";
import { HomePageLayout } from "../layout/HomePageLayout";

const MainPage = (): JSX.Element => {
  const router = useRouter();
  const { setToken } = useContext(PersonalTokenContext);

  useEffect(() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("token"))
      router.push("/activegames");
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const url_token = router.query.token as string;
      if (typeof url_token !== "undefined") {
        localStorage.setItem("token", url_token);
        setToken(url_token);
        window.location.replace("/profile");
      }
    }
  }, [router.isReady]);

  return (
    <HomePageLayout>
      <ul className="home__list">
        <li>Play pong with your friends</li>
        <li>Watch games online</li>
        <li>Increase your rating</li>
        <li>Chat with friends</li>
      </ul>

      <div>
        <Button
          appearance="primary"
          image="/42_Logo.svg"
          size="large"
          onClick={() => Router.push("http://localhost/api/auth/login42")}
        >
          OAuth
        </Button>
        &nbsp;
        <Button
          size="large"
          appearance="primary"
          onClick={() => Router.push("/account/login")}
        >
          Login
        </Button>
        &nbsp;
        <Button
          size="large"
          appearance="primary"
          onClick={() => Router.push("/account/register")}
        >
          Registration
        </Button>
      </div>

      <h2 className="home__h2">Classic pong from 1972</h2>
      <img src="/table.png" className="home__table_image" />
      <p>
        Pong is a table tennis–themed arcade sports video game, featuring simple
        two-dimensional graphics, manufactured by Atari and originally released
        in 1972.
      </p>
      <p>
        It was one of the earliest arcade video games; it was created by Allan
        Alcorn as a training exercise assigned to him by Atari co-founder Nolan
        Bushnell, but Bushnell and Atari co-founder Ted Dabney were surprised by
        the quality of Alcorn's work and decided to manufacture the game.
      </p>
      <p>
        Bushnell based the game's concept on an electronic ping-pong game
        included in the Magnavox Odyssey, the first home video game console. In
        response, Magnavox later sued Atari for patent infringement.
      </p>
    </HomePageLayout>
  );
};

export default MainPage;
