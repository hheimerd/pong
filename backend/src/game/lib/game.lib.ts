import { Player } from "./player.lib";
import { Socket } from 'socket.io';
import { Ball } from "./ball.lib";
import { GameObject  } from "./game-object.lib";
export class Game {
    payers: Player[];
    ball: Ball;
    objects: GameObject[];
    screenWidth: number;
    screenHeight: number;
    connections: Socket[];

    constructor(screenWidth, screenHeight, connections, gameMod) {
        this.connections = connections;
        this.screenHeight = screenHeight;
        this.screenWidth = screenWidth;
        this.payers[0] = new Player(10, (screenHeight - 100) / 2, screenHeight);
        this.payers[1] = new Player(screenWidth - 20, (screenHeight - 100) / 2, screenHeight);
        this.ball = new Ball(this, (screenWidth - 15) / 2, (screenHeight - 15) / 2, screenWidth, screenHeight);
        if (gameMod == 1) {
            this.objects = new Array(2);
            this.objects[0] = new GameObject(screenWidth / 4, screenHeight / 3 - 20, screenWidth / 2, 40);
            this.objects[1] = new GameObject(screenWidth / 4, screenHeight / 3 * 2 - 20, screenWidth / 2, 40);
        } else if (gameMod == 2) {
            this.objects = new Array(4);
            this.objects[0] = new GameObject(screenWidth / 4 - 20, 0, 40, screenHeight / 4);
            this.objects[1] = new GameObject(screenWidth / 4 * 3 - 20, 0, 40, screenHeight / 4);
            this.objects[2] = new GameObject(screenWidth / 4 - 20, screenHeight - screenHeight / 4, 40, screenHeight / 4);
            this.objects[3] = new GameObject(screenWidth / 4 * 3 - 20, screenHeight - screenHeight / 4, 40, screenHeight / 4);
        } else
            this.objects = null;
    }
    update() {
        this.ball.update();
        for (const i in this.connections)
            if (this.connections[i] != null)
                if (this.payers[0].score > 19 || this.payers[1].score > 19)
                    this.connections[i].emit('win', this.payers[0].score > 19 ? this.payers[0] : this.payers[1] );
                else
                    this.connections[i].emit('newFrame', this.payers[0].x, this.payers[0].y, this.payers[1].x, this.payers[1].y, this.ball.x, this.ball.y);
    }
}
//# sourceMappingURL=game.js.map