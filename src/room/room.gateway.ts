import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';
import { RoomService } from './room.service';
import { Socket } from 'socket.io';
import { events } from 'src/wsServer';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: { room_id: string }) {
    if (body.room_id !== '') {
      let user = this.userService.getClient(client);
      this.roomService.joinRoom(client, user, body.room_id);

      events.sendInfoToAllClientsOnJoin(body.room_id, user);
      events.sendAllUserOnRoomOnJoin(client, body.room_id, this.userService.getAllUsers(this.roomService.getAllUsersOnRoom(body.room_id)));
    }
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room_id: string) {
    if (room_id !== '') {
      if (client.rooms.has(room_id)) {
        this.roomService.leaveRoom(client, room_id);
      }
    }
  }
}
