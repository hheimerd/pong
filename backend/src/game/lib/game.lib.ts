import { Player } from "./player.lib";
import { Ball } from "./ball.lib";
import { GameObject  } from "./game-object.lib";
import { MoveDirectionEnum } from "../entities/game.entity";
import { EventEmitter } from "events"
import { SocketWithData } from "../game.gateway";
import { Bonus } from "./bonus.lib";

export class Game extends EventEmitter {
  connections: SocketWithData[];
  id: string;
  pause: boolean;
  players: Player[] = [];
  playersReadyFlag: boolean[] = [];
  ball: Ball;
  objects: GameObject[];
  screenWidth: number;
  screenHeight: number;
  bonus: Bonus;
  map: number;
  mode: number;

  constructor(id: string, connections: SocketWithData[], screenWidth: number, screenHeight: number, gameMod: number) {
    super();
	  this.pause = false;
    this.id = id;
    this.connections = connections;
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.players[0] = new Player(10, (screenHeight - 100) / 2, screenHeight);
    this.players[1] = new Player(screenWidth - 30, (screenHeight - 100) / 2, screenHeight);
    this.playersReadyFlag[0] = false;
    this.playersReadyFlag[1] = false;
    this.map = -1;
    this.mode = -1;
  }

  sendToAll(eventName: string, ...args) {
    this.connections.forEach((s) => {
      s.emit(eventName, args);
    })
  }

  setMap(mapId: number) {
    let w = this.screenWidth;
    let h = this.screenHeight;
    this.objects = new Array();
    if (mapId == 1) {
      this.objects.push(new GameObject('wall', w / 4, h / 3 - 20, w / 2, 40));
      this.objects.push(new GameObject('wall', w / 4, h / 3 * 2 - 20, w / 2, 40));
    }
  }

  movePlayer(playerNumber: number, direction: MoveDirectionEnum) {
    this.players[playerNumber].move(direction);
  }

    startNewRound() {
        if (this.mode == 1 && (this.players[0].score + this.players[1].score) % 5 === 0) {
          this.bonus = new Bonus(
          this.players,
          this.screenWidth / 2,
          this.screenHeight / 2,
          this.players[0].score > this.players[1].score ? 5 : -5,
          this.screenWidth,
          this.screenHeight,
          (this.players[0].score + this.players[1].score) === 15 ? 7 : 0,
          (this.players[0].score + this.players[1].score) % 5 === 0 ? 50 : 0);
        }
        this.ball.newRound();
    }

    getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    setPlayerReady(playerNumber: number, settings: number[]) {
      if (this.map == -1)
        this.map = settings[0];
      else if (this.map != settings[0])
        this.map = this.getRandomInt(0, 2);
      if (this.mode == -1)
        this.mode = settings[1];
      else if (this.mode != settings[1])
        this.mode = this.getRandomInt(0, 2);
      this.playersReadyFlag[playerNumber - 1] = true;
      if (this.playersReadyFlag[0] == true && this.playersReadyFlag[1] == true) {
        this.setMap(this.map);
        this.ball = new Ball(this.objects, this.players, (this.screenWidth - 15) / 2, (this.screenHeight - 15) / 2, this.screenWidth, this.screenHeight);
        this.emit('gameStart', this.map);
      }
    }

    setPause(bool: boolean) {
	    this.players[0].setPause(bool);
	    this.players[1].setPause(bool);
      this.pause = bool;
    }

    update() {
      let eventName: string;
      let pl: number;
      if (this.pause) return;
      this.bonus?.update();
      if (this.bonus && (pl = this.bonus.collect()) != 0) {
        this.emit('collect', pl, this.bonus.sizeBonus);
        this.bonus = undefined;
      }
	    eventName = this.ball.update();
      if (eventName == 'goal') {
        if (this.players[0].score == 11 || this.players[1].score == 11) {
          this.emit('win', this.players[0].score, this.players[1].score);
	      this.setPause(true);
	      return;	
        }
          this.emit('goal', this.players[0].score, this.players[1].score);
          this.startNewRound();
      } else {   
        this.emit('newFrame',
          this.players[0].x, this.players[0].y,
          this.players[1].x, this.players[1].y,
          this.ball.x, this.ball.y,
          this.bonus?.x, this.bonus?.y);
      }
    }
}
//# sourceMappingURL=game.js.map
