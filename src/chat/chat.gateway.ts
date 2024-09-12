import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { serverVar, setServer } from 'src/wsServer';
import { PublicChatDTO } from './dto/publicChat.dto';
import { PrivateChatDto } from './dto/privateChat.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayInit {
  handleConnection(client: Socket, ...args: any[]) {
    client.join('lobby');
  }
  afterInit(server: Server) {
    setServer(server);
  }
  @SubscribeMessage('sendPublicChat')
  handlePublicMessage(@ConnectedSocket() client: Socket, @MessageBody() chatText: PublicChatDTO) {
    //Recibo el texto y lo envio a todos que estan en el canal
    serverVar.to(chatText.room_id).emit('publicChat', { id: client.id, text: chatText.text });
  }

  @SubscribeMessage('sendPrivateChat')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() chatText: PrivateChatDto) {
    serverVar.to(chatText.to_id).emit('privateChat', { id: client.id, text: chatText.text });
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room_id: string) {
    if (room_id !== '') {
      if (!client.rooms.has(room_id)) {
        client.join(room_id);
        serverVar.to(room_id).emit('onJoinedRoom', client.id);
      }
    }
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room_id: string) {
    if (room_id !== '') {
      if (client.rooms.has(room_id)) {
        client.leave(room_id);
        serverVar.to(room_id).emit('onLeavedRoom', client.id);
      }
    }
  }
}
