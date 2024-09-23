import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { events, serverVar, setServer } from 'src/wsServer';
import { PublicChatDTO } from './dto/publicChat.dto';
import { PrivateChatDto } from './dto/privateChat.dto';
import { ChatService } from './chat.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() wss: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    let display: string = client.handshake.query.display as string;
    if (display) {
      this.userService.addNewClient(client, display);
      client.on('disconnecting', (x) => {
        const user = this.userService.getClient(client);
        this.userService.removeClient(client);
        this.roomService.leaveAllRooms(client);
        events.sendInfoToAllClientsOnUserDisconect(Array.from(client.rooms), user);
      });
    }
  }
  afterInit(server: Server) {
    //console.log('server initialized');
    setServer(server);
  }
  @SubscribeMessage('sendPublicChat')
  handlePublicMessage(@ConnectedSocket() client: Socket, @MessageBody() chatText: PublicChatDTO) {
    this.chatService.sendMessageToRoom(chatText.room_id, chatText.message, this.userService.getClient(client));
  }

  @SubscribeMessage('sendPrivateChat')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() chatText: PrivateChatDto) {
    this.wss.to(chatText.to_id).emit('privateChat', { id: client.id, text: chatText.message });
  }

  @SubscribeMessage('getClientListByRoom')
  getClientListByRoom(@ConnectedSocket() client: Socket, @MessageBody() room_id: string) {}

  @SubscribeMessage('getMyRooms')
  getMyRooms(@ConnectedSocket() client: Socket) {
    this.wss.to(client.id).emit('myRooms', Array.from(client.rooms));
  }
}
