import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { retry } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/common/auth/auth.service';
import { ConnectGameDto } from './dto/connect-game.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { GameCreatedDto } from './dto/game-connected.dto';
import { GameEntity, MoveDirectionEnum } from './entities/game.entity';

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
    console.log(dto);
    
    const targetGame = this._games.find(g => g.id == dto.id);
    client.data.game = targetGame;
    

    targetGame.connect(client);
    client.emit('gameConnected', { playersId: targetGame.getPlayersId() });
    targetGame.addEventListenner('newFrame', (...args) =>  {
      client.emit('newFrame', ...args);
    })
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

      const isReconnected = game.tryReconnect(client);
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
    client.emit('ready', client.data.playerNumber);
  }

  @SubscribeMessage('selectGameMap')
  selectGameMap(
    @MessageBody() mapId: number,
    @ConnectedSocket() client: SocketWithData
  ) {
    if (!client.data.playerNumber) {
      client.emit('error', 'You not a player!');
      return;
    }
    client.data.game.setMap(mapId);

  }

  @SubscribeMessage('checkIsPlayer')
  checkIsPlayer(
    @ConnectedSocket() client: SocketWithData,
  ) {
    return !! client.data?.game?.isPlyer(client.data.id)
  }

  @SubscribeMessage('connectAsPlayer')
  connectAsPlayer(
    @ConnectedSocket() client: SocketWithData,
  ) {
    const isPlayer = this.checkIsPlayer(client);
    if (!isPlayer) return;
  
    client.data.game.tryReconnect(client);
    client.emit('connectedAsPlayer');
  }

  @SubscribeMessage('createGame')
  createGame(
    @MessageBody() dto: CreateGameDto,
    @ConnectedSocket() client: SocketWithData,
  ) {
    const game = new GameEntity(dto.name, dto.userId);
    this._games.push(game);
    
    game.connect(client);
    game.setPlayer(client);
    
    client.data.game = game;

  
    console.log(dto);
    console.log(client.data);
    
    client.emit('gameCreated', {
      game: {
        id: game.id,
      }
    } as GameCreatedDto);
    
  }

  
}
