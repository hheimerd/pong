import { randomUUID } from 'crypto';
import { SocketWithData } from '../game.gateway';
import { Game } from '../lib/game.lib'

export class Player {
  socket: SocketWithData;
  isReady: boolean = false;
  id: number;
  number: number

  constructor(id: number) {
    this.id = id;
  }
}

export enum MoveDirectionEnum {
  UP = 'up',
  DOWN = 'down'
}

export class GameEntity {
  private _connections: SocketWithData[] = [];
  private _players: Player[] = [];
  private _game: Game;
  private readonly name;
  public readonly id: string;
  private _timer: NodeJS.Timeout;

  constructor(name: string, playerId?: number) {
    this.id = randomUUID();
    this.name = name;
    this._game = new Game(1024, 768, this._connections, 1);
    if (playerId) {
      this._players[1] = new Player(playerId);
    }
  }

  connect(socket: SocketWithData) {
    this._connections.push(socket);
  }

  setPlayer(socket: SocketWithData): boolean {
    if (this._players[0] && this._players[1]) {
      const reconnectSuccess = this.tryReconnect(socket);
      if (!reconnectSuccess) {
        return false;
      }
    }
   
    const player = new Player(socket.data.id);

    if (!this._players[0]) {
      this._players[0] = player;
    } else {
      this._players[1] = player;
    } 

    this.setPlayerNumber(player, socket);
    return true;
  }

  tryReconnect(socket: SocketWithData): boolean {
    const player = this._players.find((p) => p.id === socket.data.id);
    if (!player) {
      return false;
    }
    
    const playerSocket = this._connections.find((s) => s.data.id === socket.data.id);
    if (!playerSocket) {
      this._connections.push(socket);
    }

    this.setPlayerNumber(player, socket);
    socket.data.playerNumber = player.number;

    player.socket = socket;
  }

  setPlayerNumber(player: Player, socket: SocketWithData) {
    player.number = this._players.findIndex((p) => p.id === socket.data.id) + 1;
  }

  setPlayerReady(playerNumber: number) {
    this._players[playerNumber - 1].isReady = true;
    if (this._players.every(p => p.isReady)) {
      this.animate();
    }
  }

  animate() {
    this._timer = this._timer = setInterval(() => {
      this._game.update();
    }, 30);
    this._timer = setTimeout(() => {
      this.stop();
    }, 10000)
  }

  stop() {
    clearInterval(this._timer);
  }

  onPlayerDisconnected(socket: SocketWithData) {
    const player = this._players.find((p) => p.id === socket.data.id);
    player.socket = undefined;
    
    this._players.forEach((p) => p.isReady = false);
  }

  movePlayer(playerNumber: number, direction: MoveDirectionEnum) {
    const player = this._game.payers[playerNumber - 1];
    player.move(direction);
  }

  onDisconnect(socket: SocketWithData) {
    var index = this._connections.indexOf(socket);
    if (index !== -1) {
      this._connections.splice(index, 1);
    }
  }

}