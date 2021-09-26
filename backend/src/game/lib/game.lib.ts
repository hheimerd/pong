import { Player } from "./player.lib";
import { Ball } from "./ball.lib";
import { GameObject  } from "./game-object.lib";
import { MoveDirectionEnum } from "../entities/game.entity";
import { GameEmitter } from "./game-emitter";

export class Game {
    isMenu: boolean;
    emiter: GameEmitter;
    players: Player[] = [];
    playersReadyFlag: boolean[];
    ball: Ball;
    objects: GameObject[];
    screenWidth: number;
    screenHeight: number;

    constructor(emiter: GameEmitter, screenWidth: number, screenHeight: number, gameMod: number) {
        this.isMenu = true;
        this.emiter = emiter;
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.players[0] = new Player(10, (screenHeight - 100) / 2, screenHeight);
        this.players[1] = new Player(screenWidth - 20, (screenHeight - 100) / 2, screenHeight);
        this.playersReadyFlag[0] = false;
        this.playersReadyFlag[1] = false;
        this.objects = new Array(new GameObject('pl2goal', 0, 0, 1, screenHeight), new GameObject('pl1goal', screenWidth, 0, 1, screenHeight),
            new GameObject('wall', 0, 0, screenWidth, 1), new GameObject('wall', 0, screenHeight, screenWidth, 1));
        if (gameMod == 1) {
            this.objects.push(new GameObject('wall', screenWidth / 4, screenHeight / 3 - 20, screenWidth / 2, 40));
            this.objects.push(new GameObject('wall', screenWidth / 4, screenHeight / 3 * 2 - 20, screenWidth / 2, 40));
        } else if (gameMod == 2) {
            this.objects.push(new GameObject('wall', screenWidth / 4 - 20, 0, 40, screenHeight / 4));
            this.objects.push(new GameObject('wall', screenWidth / 4 * 3 - 20, 0, 40, screenHeight / 4));
            this.objects.push(new GameObject('wall', screenWidth / 4 - 20, screenHeight - screenHeight / 4, 40, screenHeight / 4));
            this.objects.push(new GameObject('wall', screenWidth / 4 * 3 - 20, screenHeight - screenHeight / 4, 40, screenHeight / 4));
        }
        this.ball = new Ball(this.objects, this.players, (screenWidth - 15) / 2, (screenHeight - 15) / 2, screenWidth, screenHeight);
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
        if (eventName == 'pl2goal' || eventName == 'pl1goal') {
            this.emiter.emit(eventName, this.players[0].score, this.players[1].score);
            this.startNewRound();
        } else {
            this.emiter.emit('newframe', this.players[0].x, this.players[0].y, this.players[1].x, this.players[1].y, this.ball.x, this.ball.y);
        }
    }
}
//# sourceMappingURL=game.js.map