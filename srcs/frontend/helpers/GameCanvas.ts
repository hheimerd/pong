export class Canvas {
    canvasEl: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    map: number;
    mode: number;
    position: number;
    constructor(gameRef, {width = 1024, height = 768, zIndex = 0}) {
      this.canvasEl = document.createElement("canvas");
      this.context = this.canvasEl.getContext("2d");
      this.canvasEl.width = width;
      this.canvasEl.height = height;
      this.canvasEl.style.zIndex = zIndex.toString();
      this.canvasEl.style.position = 'absolute';
      this.map = 0;
      this.mode = 0;
      this.position = -1;
  
      gameRef.append(this.canvasEl);
    }
    fill(color: string) {
      this.context.fillStyle = color;
      this.drawRoundRectangle(0, 0, this.canvasEl.width, this.canvasEl.height, 20, color);
    }
    clear() {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }
    drawRectangle(startX: number, startY: number, width: number, height: number, color: string) {
      this.context.fillStyle = color;
      this.context.fillRect(startX, startY, width, height);
    }
    drawRoundRectangle(x: number, y: number, width: number, height: number, round: number, fill: string) {
      let radius = {topLeft: round, topRight: round, botRight: round, botLeft: round};
      let draw = this.context;
      draw.beginPath();
      draw.moveTo(x + radius.topLeft, y);
      draw.lineTo(x + width - radius.topRight, y);
      draw.quadraticCurveTo(x + width, y, x + width, y + radius.topRight);
      draw.lineTo(x + width, y + height - radius.botRight);
      draw.quadraticCurveTo(x + width, y + height, x + width - radius.botRight, y + height);
      draw.lineTo(x + radius.botLeft, y + height);
      draw.quadraticCurveTo(x, y + height, x, y + height - radius.botLeft);
      draw.lineTo(x, y + radius.topLeft);
      draw.quadraticCurveTo(x, y, x + radius.topLeft, y);
      draw.closePath();
      if (fill) {
        draw.fillStyle = fill;
        draw.fill();
      }
    }
    drawCircle(x: number, y: number, radius: number, color: string) {
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
      this.context.fillStyle = color;
      this.context.fill();
      this.context.stroke();
    }
    write(x: number, y: number, text: string, color: string) {
      this.context.fillStyle = color;
      this.context.font = "bold 20px Bradley Hand";
      this.context.fillText(text, x, y);
    }
    drawScore(placeholder: number, score: string, color: string) {
      this.drawRectangle(placeholder, 5, 30, 20, "#e0cfb1");
      this.write(placeholder + 5, 20, score, color);
    }
    drawFon(mapId: number) {
      const w = this.canvasEl.width;
      const h = this.canvasEl.height;
      this.clear();
      this.fill("#000000bf");
      this.drawRectangle(w / 2 - 2, 0, 4, h, "#057a68");
      if (mapId == 1) {
        this.drawRoundRectangle(w / 4, h / 3 - 20, w / 2, 40, 5, '#dfa876');
        this.drawRoundRectangle(w / 4, h / 3 * 2 - 20, w / 2, 40, 5, '#dfa876');
      }
    }
    waitScreen(string: string) {
      const w = this.canvasEl.width;
      const h = this.canvasEl.height;
      this.fill("#00000066");
      this.drawRoundRectangle(w / 4, (h * 2 ) / 5, w / 2, h / 5, 10, "#957a68");
      this.write(w / 2 - 140, h / 2 - 40, "Your opponent has been", "#000000");
      this.write(w / 2 - 70, h / 2 - 10, "disconnected", "#000000");
      this.write(w / 2 - 70, h / 2 + 20, "game paused", "#000000");
      this.write(w / 2 - 200, h / 2 + 50, "if you are ready to play press space", "#000000");
    }
    menu() {
      const w = this.canvasEl.width;
      const h = this.canvasEl.height;
      let mode = this.mode == 0 ? 'classic' : ' bonus ';
      this.fill('#057a68');
      this.drawRoundRectangle(w / 2 - 140, h / 2 - 25 + 40 * this.position, 280, 40, 10, '#dfa876');
      this.write(w / 2 - 50, h / 2 - 40, ('game map ' + (this.map + 1).toString(10)), '#000000');
      this.write(w / 2 - 80, h / 2, 'game mode ' + mode, '#000000');
      this.write(w / 2 - 25, h / 2 + 40, 'PLAY', '#000000');
    }

    setPosition(dir: string) {
      if (dir == 'up' && this.position > -1)
        this.position--;
      if (dir == 'down' && this.position < 1)
        this.position++;
      this.menu();
    }

    select(): number[] {
      if (this.position == 1) {
        this.clear();
        return [this.map, this.mode, this.position];
      }
      if (this.position == 0) this.mode = this.mode + 1 > 1 ? 0 : 1;
      if (this.position == -1) this.map = this.map + 1 > 1 ? 0 : 1;
      this.menu();
      return [this.map, this.mode, this.position];
    }
  }
