export class Player {
  x;
  y;
  width;
  height;
  speed;
  score;
  screenHeight;
  constructor(x, y, screenHeight, speed = 7, width = 10, height = 100) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.width = width;
      this.height = height;
      this.score = 0;
      this.screenHeight = screenHeight;
  }
  move(dir) {
      if (dir === 'up' && this.y - this.speed > 0)
          this.y -= this.speed;
      else if (dir === 'down' && this.y + this.height + this.speed < this.screenHeight)
          this.y += this.speed;
  }
  scoreInc() {
      this.score++;
  }
}