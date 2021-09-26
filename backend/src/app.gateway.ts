import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
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
    
    const userPayload = await this.authService.verifyToken(authToken);
    client.data.id = userPayload.id;
    client.data.name = userPayload.name;
    
    this.userService.update(userPayload.id, {
      status: UserStatus.Online as unknown,
    })
  }

  handleDisconnect(client: Socket) {
    this.userService.update(client.data.id, {
      status: UserStatus.Offline as unknown,
    })
  }

}
