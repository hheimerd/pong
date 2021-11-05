import React, {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import io from "socket.io-client";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";
import { Canvas } from "../../helpers/GameCanvas";
import useKeypress from "../../hooks/useKeypress";
import zIndex from "@material-ui/core/styles/zIndex";

export enum MoveDirectionEnum {
  UP = "up",
  DOWN = "down",
}

//# sourceMappingURL=canvas.js.map
export default function Game(): JSX.Element {
  const router = useRouter();
  const user = useUser();

  const { id: gameId } = router.query;

  // https://stackoverflow.com/questions/54346040/react-hooks-ref-is-not-avaiable-inside-useeffect/54346500
  const gameRef = useCallback(
    (nodeRef) => {
      if (!gameId) return;
      // nodeRef = gameRef.current
      if (nodeRef !== null) {
        const socket = io("ws://" + process.env.GAME_API_HOST, {
          extraHeaders: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        let num = -1;
        let ready = false;
        let playersSize = [100, 100];
        const screen = [
          new Canvas(nodeRef, { zIndex: 1 }),
          new Canvas(nodeRef, { zIndex: 2 }),
          new Canvas(nodeRef, { zIndex: 3 }),
        ];
        screen[0].drawFon();

        socket.on("gameConnected", (response: GameConnectedResponse) => {
          const playersId = response.playersId;

          let isPlayer = playersId.includes(user.id);
          if (!isPlayer) return;

          socket.on("connectedAsPlayer", () => {
            console.log("connectedAsPlayer");
            const onKeyDown = (e) => {
              e.preventDefault();
              if (!ready) {
                if (e.key == "ArrowUp")
                  screen[2].setPosition('up');
                else if (e.key == "ArrowDown")
                  screen[2].setPosition('down');
                else if (e.key == " ")
                  ready = screen[2].select(); 
              } else {
                if (e.key == "ArrowUp")
                  socket.emit("gamePlayerMove", MoveDirectionEnum.UP);
                else if (e.key == "ArrowDown")
                  socket.emit("gamePlayerMove", MoveDirectionEnum.DOWN);
                else if (e.key == " ") {
                  socket.emit("playerReady");
                }
              }
            };
            document.addEventListener("keydown", onKeyDown);
          });
          socket.emit("connectAsPlayer");
        });

        socket.on("error", (e) => {
          console.log(e);
        });

        socket.emit("connectToGame", { id: gameId });

        socket.on('menu', (args) => {
          let mode = args[0][1] == 1 ? 'classic' : 'with bonuses'; 
          screen[2].clear();
          screen[2].fill('#000000');
          screen[2].write(20, 20, 'game map ' + args[0][0].toString(10), '#ffffff');
          screen[2].write(20, 60, 'game mode ' + mode, '#ffffff');
          screen[2].write(20, 100, 'PLAY', '#ffffff');
          screen[2].drawRectangle(10, 20 * args[0][2], 10, 20, '#ffffff');
        });
        socket.on("newFrame", (args) => {
          const [pl1x, pl1y, pl2x, pl2y, ballx, bally, bonusx, bonusy] = args;
          screen[1].clear();
          screen[1].drawRectangle(pl1x, pl1y, 20, playersSize[0], "#dfa876");
          screen[1].drawRectangle(pl2x, pl2y, 20, playersSize[1], "#dfa876");
          screen[1].drawCircle(ballx, bally, 15, "#dfa876");
          if (bonusx != undefined && bonusy != undefined) {
            screen[1].drawCircle(bonusx, bonusy, 10, "#123123");
          }
        });
        socket.on("collect", (args) => {
          const [playerNumber, sizeBonus] = args;
          playersSize[playerNumber - 1] += sizeBonus;
        });
        socket.on("goal", (score: number) => {
          screen[2].clear();
          screen[2].drawScore(
            screen[2].canvasEl.width * 0.25,
            score[0],
            "#ff0000"
          );
          screen[2].drawScore(
            screen[2].canvasEl.width * 0.75,
            score[1],
            "#00ff00"
          );
        });
        socket.on("winner", (pl: number) => {
          screen[2].fill("#057a68");
          screen[2].write(
            screen[2].canvasEl.width / 2 - 50,
            screen[2].canvasEl.height / 2 + 20,
            "Player " + pl + " wins",
            "#000000"
          );
        });
        socket.on("ready", (playerNumber: number) => {
          screen[2].write(
            screen[1].canvasEl.width / 2 - 60,
            screen[1].canvasEl.height / 2 - 20 + num * 20,
            "Player " + playerNumber + " ready!",
            "#000000"
          );
        });
      }
      //# sourceMappingURL=client.js.map
    },
    [gameId, user]
  );

  return (
    <InnerPageLayout>
      <div className="wrapper">
        <div ref={gameRef}></div>
      </div>
    </InnerPageLayout>
  );
}

type GameConnectedResponse = { playersId: number[] };
