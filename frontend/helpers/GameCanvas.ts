export class Canvas {
    canvasEl: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(gameRef, {width = 1024, height = 768, zIndex = 0}) {
      this.canvasEl = document.createElement("canvas");
      this.context = this.canvasEl.getContext("2d");
      this.canvasEl.width = width;
      this.canvasEl.height = height;
      this.canvasEl.style.zIndex = zIndex.toString();
      this.canvasEl.style.position = 'absolute';
  
      gameRef.append(this.canvasEl);
    }
    fill(color: string) {
      this.context.fillStyle = color;
      this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }
    clear() {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }
    drawRectangle(startX: number, startY: number, width: number, height: number, color: string) {
      this.context.fillStyle = color;
      this.context.fillRect(startX, startY, width, height);
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
      this.drawRectangle(placeholder, 5, 30, 20, "#ffffff");
      this.write(placeholder + 5, 20, score, color);
    }
    waitScreen(string: string) {
      const w = this.canvasEl.width;
      const h = this.canvasEl.height;
      this.fill("#e0cfb101");
      this.drawRectangle(w / 3, (h * 2) / 5, w / 3, h / 5, "#ffffff");
      if (string === "wait")
        this.write(w / 2 - 80, h / 2 + 30, "press space to start", "#000000");
      else if (string === "reconnect")
        this.write(w / 2 - 80, h / 2 + 30, "witing for reconnect", "#000000");
    }
  }