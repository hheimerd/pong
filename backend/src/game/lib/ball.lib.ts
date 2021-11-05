import { GameObject } from "./game-object.lib";
import { Player } from "./player.lib";

export class Ball {
    x: number;
    y: number;
    width: number;
    height: number;
    xSpeed: number;
    ySpeed: number;
    screenWidth: number;
    screenHeight: number;
    objects: GameObject[];
    players: Player[];
    constructor(objects: GameObject[], players: Player[], x: number, y: number, screenWidth: number, screenHeight: number,
        xSpeed = 5, ySpeed = 5, width = 15, height = 15) {
        this.objects = objects;
        this.players = players;
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.width = width;
        this.height = height;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
    
    check(object: GameObject) {
	if (this.ySpeed > 0) {
            if (this.y > object.y + object.height)
                return 'skip';
            else if (this.y + this.height > object.y && this.x > object.x && this.x < object.x + object.width) {
                this.ySpeed *= -1;
                return object.name;
	        }
        }
        else {
            if (this.y < object.y)
                return 'skip';
            else if (this.y - this.height < object.y + object.height && this.x > object.x  && this.x < object.x + object.width) {
                this.ySpeed *= -1;
                return object.name;
	        }
        }
        if (this.xSpeed > 0) {
            if (this.x > object.x)
                return 'skip';
            else if (this.x + this.width > object.x && this.y > object.y && this.y < object.y + object.height) {
                this.xSpeed *= -1;
                return object.name;
	        }
        }
        else {
            if (this.x < object.x + object.width)
                return 'skip';
            else if (this.x - this.width < object.x + object.width && this.y > object.y && this.y < object.y + object.height) {
                this.xSpeed *= -1;
                return object.name;
	        }
        }
    }

    newRound() {
        this.x = (this.screenWidth - 15) / 2;
        this.y = (this.screenHeight - 15) / 2;
    }

    update() {
      let objName: string;
	  if (this.y - this.height <= 0 || this.y + this.height >= this.screenHeight)
        this.ySpeed *= -1;
      if (this.x - this.width <= 0) {
        this.players[1].scoreInc();
        this.newRound();
	    return 'goal';
      }
      if (this.x + this.width >= this.screenWidth) {
        this.players[0].scoreInc();
        this.newRound();
	    return 'goal';
      }
      objName = this.check(this.players[0]);
      objName = this.check(this.players[1]);
      for (let i in this.objects) {
        objName = this.check(this.objects[i]);
        console.log(objName);
      }
      this.move();
    }
}
//# sourceMappingURL=ball.js.map%
