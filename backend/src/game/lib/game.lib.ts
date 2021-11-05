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
	    this.ball = new Ball(this.objects, this.players, (screenWidth - 15) / 2, (screenHeight - 15) / 2, screenWidth, screenHeight);
        this.setMap(2);
    }

    sendToAll(eventName: string, ...args) {
        this.connections.forEach((s) => {
            s.emit(eventName, args);
        })
    }

    setMap(mapId: number) {
        console.log(mapId);
        let w = this.screenWidth;
        let h = this.screenHeight;
        this.objects = new Array();
        if (mapId == 2) {
            this.objects.push(new GameObject('wall', w / 4, h / 3 - 20, w / 2, 40));
            this.objects.push(new GameObject('wall', w / 4, h / 3 * 2 - 20, w / 2, 40));
            console.log(this.objects);
        }
    }

    movePlayer(playerNumber: number, direction: MoveDirectionEnum) {
      this.players[playerNumber].move(direction);
    }

    startNewRound() {
        if ((this.players[0].score + this.players[1].score) % 5 === 0) {
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

    setPlayerReady(playerNumber: number) {
        this.playersReadyFlag[playerNumber] = true;
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
