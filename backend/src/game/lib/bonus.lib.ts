import { GameObject } from "./game-object.lib";
import { Player } from "./player.lib";

export class Bonus extends GameObject {
  xSpeed: number;
  ySpeed: number;
  screenWidth: number;
  screenHeight: number;
  players: Player[];
  speedBonus: number;
  sizeBonus: number;
  constructor(players: Player[], x: number, y: number, xSpeed: number, screenWidth: number, screenHeight: number, speedBonus: number, sizeBonus: number) {
    super('bonus', x, y, 10, 10);
    this.xSpeed = xSpeed;
    this.ySpeed = 5;
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.players = players;
    this.speedBonus = speedBonus;
    this.sizeBonus = sizeBonus;
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  collect() {
    let plTop = this.players[0].y;
    let plBot = this.players[0].y + this.players[0].height;
    let plEdge = this.players[0].x + this.players[0].width;
    if (this.x < plEdge && this.y > plTop && this.y < plBot) {
      this.players[0].collectBonus(this);
      return 1;
    }
    plTop = this.players[1].y;
    plBot = this.players[1].y + this.players[1].height;
    plEdge = this.players[1].x;
    if (this.x > plEdge && this.y > plTop && this.y < plBot) {
      this.players[1].collectBonus(this);
      return 2;
    }
    return 0;
  }

  update() {
	if (this.y - 10 <= 0 || this.y + 10 >= this.screenHeight)
      this.ySpeed *= -1;
    if (this.x - 10 <= 0 || this.x + 10 >= this.screenWidth)
      this.xSpeed *= -1;
    this.move();
  }
}