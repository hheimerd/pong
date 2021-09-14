import React, { useLayoutEffect, useState, useRef, useCallback } from "react";
import { Button, Htag } from "../../components";
import useKeypress from "../../hooks/useKeypress";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import io from "socket.io-client";

class Canvas {
  window;
  context;
  constructor(gameRef, width = 1024, height = 768) {
    this.window = document.createElement("canvas");
    this.context = this.window.getContext("2d");
    this.window.width = width;
    this.window.height = height;
    gameRef.append(this.window);
  }
  fill(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.window.width, this.window.height);
  }
  clear() {
    this.context.clearRect(0, 0, this.window.width, this.window.height);
  }
  drawRectangle(startX, startY, width, height, color) {
    this.context.fillStyle = color;
    this.context.fillRect(startX, startY, width, height);
  }
  drawCircle(x, y, radius, color) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();
  }
  write(x, y, text, color) {
    this.context.fillStyle = color;
    this.context.font = "bold 20px Bradley Hand";
    this.context.fillText(text, x, y);
  }
  drawScore(placeholder, score, color) {
    this.drawRectangle(placeholder, 5, 30, 20, "#ffffff");
    this.write(placeholder + 5, 20, score, color);
  }
  waitScreen(string) {
    const w = this.window.width;
    const h = this.window.height;
    this.fill("#e0cfb101");
    this.drawRectangle(w / 3, (h * 2) / 5, w / 3, h / 5, "#ffffff");
    if (string === "wait")
      this.write(w / 2 - 80, h / 2 + 30, "press space to start", "#000000");
    else if (string === "reconnect")
      this.write(w / 2 - 80, h / 2 + 30, "witing for reconnect", "#000000");
  }
}
//# sourceMappingURL=canvas.js.map
export default function Game(): JSX.Element {
  const node = useRef<HTMLDivElement>(null);
  // https://stackoverflow.com/questions/54346040/react-hooks-ref-is-not-avaiable-inside-useeffect/54346500
  const gameRef = useCallback((nodeRef) => {
    // nodeRef = gameRef.current
    if (nodeRef !== null) {
      const socket = io("ws://" + process.env.GAME_API_HOST, {
        extraHeaders: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      let num = -1;
      console.log("nodeRef", nodeRef);
      console.log("connected");
      socket.emit("createGame", { name: "1" });
      socket.emit("createGame", { name: "0" });
      const screen = [
        new Canvas(nodeRef),
        new Canvas(nodeRef),
        new Canvas(nodeRef),
      ];
      screen[0].fill("#104c87");
      screen[0].drawRectangle(
        screen[0].window.width / 2 - 2,
        0,
        4,
        screen[0].window.height,
        "#000000"
      );

      document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp") socket.emit("up", num);
        else if (e.key == "ArrowDown") socket.emit("down", num);
      });

      socket.on("playerReady", (num) => {
        screen[2].write(
          screen[1].window.width / 2 - 60,
          screen[1].window.height / 2 - 20 + num * 20,
          "Player " + (num + 1) + " ready!",
          "#000000"
        );
      });
      socket.on("playerNum", (plNum) => {
        num = plNum;
        console.log(plNum);
        screen[1].waitScreen("wait");
        document.addEventListener("keydown", (e) => {
          if (e.key == " ") socket.emit("ready", num);
          else if (e.key == "1" || e.key == "2" || e.key == "3") {
            socket.emit("map " + e.key, num);
            if (e.key == "2") {
              screen[0].clear();
              screen[0].drawRectangle(
                screen[0].window.width / 4,
                screen[0].window.height / 3 - 20,
                screen[0].window.width / 2,
                40,
                "#000000"
              );
              screen[0].drawRectangle(
                screen[0].window.width / 4,
                (screen[0].window.height / 3) * 2 - 20,
                screen[0].window.width / 2,
                40,
                "#000000"
              );
            } else if (e.key == "3") {
              screen[0].clear();
              screen[0].drawRectangle(
                screen[0].window.width / 4 - 20,
                0,
                40,
                screen[0].window.height / 4,
                "#000000"
              );
              screen[0].drawRectangle(
                (screen[0].window.width / 4) * 3 - 20,
                0,
                40,
                screen[0].window.height / 4,
                "#000000"
              );
              screen[0].drawRectangle(
                screen[0].window.width / 4 - 20,
                screen[0].window.height - screen[0].window.height / 4,
                40,
                screen[0].window.height / 4,
                "#000000"
              );
              screen[0].drawRectangle(
                (screen[0].window.width / 4) * 3 - 20,
                screen[0].window.height - screen[0].window.height / 4,
                40,
                screen[0].window.height / 4,
                "#000000"
              );
            }
          }
        });
      });
      socket.on("newFrame", (pl1x, pl1y, pl2x, pl2y, ballx, bally) => {
        console.log("clien newFrame");
        screen[1].clear();
        screen[1].drawRectangle(pl1x, pl1y, 10, 100, "#ff0000");
        screen[1].drawRectangle(pl2x, pl2y, 10, 100, "#00ff00");
        screen[1].drawCircle(ballx, bally, 15, "#ff00ff");
      });
      socket.on("goal", (pl1Score, pl2Score) => {
        screen[2].clear();
        screen[2].drawScore(screen[2].window.width / 4, pl1Score, "#ff0000");
        screen[2].drawScore(
          (screen[2].window.width / 4) * 3,
          pl2Score,
          "#00ff00"
        );
      });
      socket.on("waitForReconnect", (ready) => {
        console.log("waitForReconnect");
        screen[1].waitScreen("reconnect");
      });
      socket.on("win", (pl) => {
        console.log("win");
        screen[2].fill("#000000");
        screen[2].write(
          screen[2].window.width / 2 - 50,
          screen[2].window.height / 2 + 20,
          "Player " + pl + " wins",
          "#ffffff"
        );
      });
    }
    //# sourceMappingURL=client.js.map
  }, []);

  return (
    <InnerPageLayout>
      <div className="wrapper">
        <div ref={gameRef}></div>
      </div>
    </InnerPageLayout>
  );
}
