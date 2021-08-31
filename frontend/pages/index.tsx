import Router, { useRouter } from "next/router";
import React from "react";
import { Button } from "../components";
import { HomePageLayout } from "../layout/HomePageLayout";

const MainPage = (): JSX.Element => {
  const router = useRouter();
  if (typeof localStorage !== "undefined" && localStorage.getItem("token"))
    router.push("/dashboard");
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
          onClick={() =>
            Router.push(
              "https://api.intra.42.fr/oauth/authorize?client_id=874cf6bced4726f43e3c5c674a133dbdf8d51cbf3c9476189828170183c98be5&redirect_uri=http%3A%2F%2Flocalhost%3A3040%2Fintra_callback&response_type=code"
            )
          }
        >
          OAuth
        </Button>{" "}
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
