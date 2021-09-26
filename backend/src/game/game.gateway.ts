import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/common/auth/auth.service';
import { ConnectGameDto } from './dto/connect-game.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { GameCreatedDto } from './dto/game-connected.dto';
import { GameEntity, MoveDirectionEnum } from './entities/game.entity';
import { GameService } from './game.service';

export interface SocketWithData extends Socket {
  data: {
    id: number;
    name: string;
    game?: GameEntity;
    playerNumber?: number;
  }
}

@WebSocketGateway(81)
export class GameGateway {
  @WebSocketServer() server: Server;
  private _games: GameEntity[] = [];

  constructor(
    private readonly gameService: GameService,
    private readonly authService: AuthService
  ) {}
  
  // async handleConnection(client: Socket, ...args: any[]) {
  //   const authToken = client.handshake.headers.authorization?.substr(7);

  //   if (!authToken) {
  //     return;
  //   }
    
  //   const userPayload = await this.authService.verifyToken(authToken);
  //   client.data.id = userPayload.id;
  //   client.data.name = userPayload.name;
    
    
  // }
  
  @SubscribeMessage('connectToGame')
  connectToGame(
    @MessageBody() dto: ConnectGameDto,
    @ConnectedSocket() client: SocketWithData,
  ) {
    const targetGame = this._games.find(g => g.id == dto.id);
    client.data.game = targetGame;

    targetGame.connect(client);
  }

  @SubscribeMessage('gamePlayerMove')
  playerMove(
    @MessageBody() direction: MoveDirectionEnum,
    @ConnectedSocket() client: SocketWithData,
  ) {
    const game = client.data.game;
   
    if (!client.data.playerNumber) {
      if (!game) {
        client.emit('error', 'no game selected!');
        return;
      }

      const isReconnected = client.data.game.tryReconnect(client);
      if (!isReconnected) {
        client.emit('error', 'You not a player!');
        return;
      }
    }

    game.movePlayer(client.data.playerNumber, direction);
  }


  @SubscribeMessage('playerReady')
  playerReady(@ConnectedSocket() client: SocketWithData) {
    client.data.game.setPlayerReady(client.data.playerNumber);
  }

  @SubscribeMessage('createGame')
  createGame(
    @MessageBody() dto: CreateGameDto,
    @ConnectedSocket() client: SocketWithData,
  ) {
    const game = new GameEntity(dto.name, dto.userId);
    this._games.push(game);

    console.log(dto);
    console.log(client.data);
    
    game.connect(client);
    game.setPlayer(client);
    
    client.data.game = game;

    client.emit('gameCreated', {
      game: {
        id: game.id,
      }
    } as GameCreatedDto);
    
  }

  
}
