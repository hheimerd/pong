import { MoveDirectionEnum } from "../entities/game.entity";
import { GameObject } from "./game-object.lib";

export class Player extends GameObject {
  speed: number;
  score: number;
  screenHeight: number;
  constructor(x: number, y: number, screenHeight: number, speed = 7, width = 10, height = 100) {
        super('player', x, y, width, height);
        this.speed = speed;
        this.score = 0;
        this.screenHeight = screenHeight;
  }

  move(dir: MoveDirectionEnum) {
      if (dir == MoveDirectionEnum.UP && this.y - this.speed > 0)
          this.y -= this.speed;
      else if (dir == MoveDirectionEnum.DOWN && this.y + this.height + this.speed < this.screenHeight)
          this.y += this.speed;
  }
  
  scoreInc() {
      this.score++;
  }
}