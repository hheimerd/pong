import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from './common/auth/auth.service';
import { UserStatus } from './common/user/entities/user.entity';
import { UserService } from './common/user/user.service';
import { UserStatus as PrismaUserStatus } from '.prisma/client';

@WebSocketGateway(81)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const authToken = client.handshake.headers.authorization?.substr(7);

    if (!authToken) {
      return;
    }

    try {
      const userPayload = await this.authService.verifyToken(authToken);
      client.data.id = userPayload.id;
      client.data.name = userPayload.name;

      if (!userPayload.id) return;

      await this.userService.update(userPayload.id, {
        status: UserStatus.Online,
      });
    } catch (e) {
      return false;
    }
  }

  async handleDisconnect(client: Socket) {
    if (!client.data.id) return;

    try {
      await this.userService.update(client.data.id, {
        status: UserStatus.Offline,
      });
    } catch (e) {
      
    }
  }
}
