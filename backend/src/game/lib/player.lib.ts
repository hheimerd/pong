import { MoveDirectionEnum } from "../entities/game.entity";
import { GameObject } from "./game-object.lib";
import { Bonus } from "./bonus.lib";

export class Player extends GameObject {
  speed: number;
  score: number;
  screenHeight: number;
  pause: boolean;
  constructor(x: number, y: number, screenHeight: number, speed = 7, width = 20, height = 100) {
    super('player', x, y, width, height);
    this.speed = speed;
    this.score = 0;
    this.screenHeight = screenHeight;
	  this.pause = false;
  }

  move(dir: MoveDirectionEnum) {
    if (this.pause) return;
    if (dir == MoveDirectionEnum.UP && this.y - this.speed > 0)
      this.y -= this.speed;
    else if (dir == MoveDirectionEnum.DOWN && this.y + this.height + this.speed < this.screenHeight)
      this.y += this.speed;
  }
  
  setPause(bool: boolean) {
    this.pause = bool;
  }

  collectBonus(bonus: Bonus) {
    this.speed += bonus.speedBonus;
    this.height += bonus.sizeBonus;
  }

  scoreInc() {
    this.score++;
  }
}
