export class Ball {
    x;
    y;
    width;
    height;
    xSpeed;
    ySpeed;
    screenWidth;
    screenHeight;
    game;
    constructor(game, x, y, screenWidth, screenHeight, xSpeed = 5, ySpeed = 5, width = 15, height = 15) {
        this.game = game;
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
    check(object) {
        if (this.ySpeed > 0) {
            if (this.y > object.y + object.height)
                return;
            else if (this.y + this.height > object.y && this.x > object.x && this.x < object.x + object.width)
                this.ySpeed *= -1;
        }
        else {
            if (this.y < object.y)
                return;
            else if (this.y - this.height < object.y + object.height && this.x > object.x  && this.x < object.x + object.width)
                this.ySpeed *= -1;
        }
        if (this.xSpeed > 0) {
            if (this.x > object.x)
                return;
            else if (this.x + this.width > object.x && this.y > object.y && this.y < object.y + object.height)
                this.xSpeed *= -1;
        }
        else {
            if (this.x < object.x + object.width)
                return;
            else if (this.x - this.width < object.x + object.width && this.y > object.y && this.y < object.y + object.height)
                this.xSpeed *= -1;
        }
    }
    startNewRound() {
        for (const i in this.game.connections)
            if (this.game.connections[i] != null)
                this.game.connections[i].emit('goal', this.game.pl1.score, this.game.pl2.score);
        this.x = (this.screenWidth - 15) / 2;
        this.y = (this.screenHeight - 15) / 2;
    }
    update() {
        if (this.y - this.height <= 0 || this.y + this.height >= this.screenHeight)
            this.ySpeed *= -1;
        if (this.x - this.width <= 0) {
            this.game.pl2.scoreInc();
            this.startNewRound();
        }
        if (this.x + this.width >= this.screenWidth) {
            this.game.pl1.scoreInc();
            this.startNewRound();
        }
        this.check(this.game.pl1);
        this.check(this.game.pl2);
        if (this.game.objects != null) {
            for (const i in this.game.objects)
                this.check(this.game.objects[i]);
        }
        this.move();
    }
}
//# sourceMappingURL=ball.js.map