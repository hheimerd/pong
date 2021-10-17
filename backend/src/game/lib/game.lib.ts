import { Player } from "./player.lib";
import { Ball } from "./ball.lib";
import { GameObject  } from "./game-object.lib";
import { MoveDirectionEnum } from "../entities/game.entity";
import { EventEmitter } from "events"
import { SocketWithData } from "../game.gateway";

export class Game extends EventEmitter {
    connections: SocketWithData[];
    id: string;
    isMenu: boolean;
    players: Player[] = [];
    playersReadyFlag: boolean[] = [];
    ball: Ball;
    objects: GameObject[];
    screenWidth: number;
    screenHeight: number;

    constructor(id: string, connections: SocketWithData[], screenWidth: number, screenHeight: number, gameMod: number) {
        super();
        this.isMenu = true;
        this.id = id;
        this.connections = connections;
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.players[0] = new Player(10, (screenHeight - 100) / 2, screenHeight);
        this.players[1] = new Player(screenWidth - 20, (screenHeight - 100) / 2, screenHeight);
        this.playersReadyFlag[0] = false;
        this.playersReadyFlag[1] = false;
        let w = this.screenWidth;
        let h = this.screenHeight;
	this.ball = new Ball(this.objects, this.players, (screenWidth - 15) / 2, (screenHeight - 15) / 2, screenWidth, screenHeight);
        this.objects = new Array(new GameObject('pl2goal', -100, 0, 100, h), new GameObject('pl1goal', w, 0, 100, h),
        new GameObject('wall', 0, -100, this.screenWidth, 100), new GameObject('wall', 0, h, w, 100));
    }

    sendToAll(eventName: string, ...args) {
        this.connections.forEach((s) => {
            s.emit(eventName, args);
        })
    }

    setMap(mapId: number) {
        let w = this.screenWidth;
        let h = this.screenHeight;
        this.objects = new Array(new GameObject('pl2goal', 0, 0, 1, h), new GameObject('pl1goal', w, 0, 1, h),
        new GameObject('wall', 0, 0, this.screenWidth, 1), new GameObject('wall', 0, h, w, 1));
        if (mapId == 1) {
            this.objects.push(new GameObject('wall', w / 4, h / 3 - 20, w / 2, 40));
            this.objects.push(new GameObject('wall', w / 4, h / 3 * 2 - 20, w / 2, 40));
        } else if (mapId == 2) {
            this.objects.push(new GameObject('wall', w / 4 - 20, 0, 40, h / 4));
            this.objects.push(new GameObject('wall', w / 4 * 3 - 20, 0, 40, h / 4));
            this.objects.push(new GameObject('wall', w / 4 - 20, h - h / 4, 40, h / 4));
            this.objects.push(new GameObject('wall', w / 4 * 3 - 20, h - h / 4, 40, h / 4));
        } 
    }

    movePlayer(playerNumber: number, direction: MoveDirectionEnum) {
        this.players[playerNumber].move(direction);
    }

    startNewRound() {
        this.ball.newRound();
    }

    setPlayerReady(playerNumber: number) {
        this.playersReadyFlag[playerNumber] = true;
    }

    update() {
        let eventName: string;
        eventName = this.ball.update();
        if (eventName == 'goal') {
            this.emit('goal', this.players[0].score, this.players[1].score);
            this.startNewRound();
        } else {   
            this.emit('newFrame', this.players[0].x, this.players[0].y, this.players[1].x, this.players[1].y, this.ball.x, this.ball.y);
        }
    }
}
//# sourceMappingURL=game.js.map
