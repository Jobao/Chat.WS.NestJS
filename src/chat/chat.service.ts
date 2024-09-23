import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/user/user.service';
import { events, serverVar } from 'src/wsServer';

@Injectable()
export class ChatService {
  roomMapClientList: Map<string, { id: string; display: string }[]> = new Map();
  clientList: Map<string, string> = new Map();

  onConnection(socket: Socket, displayName: string) {
    if (!socket && !displayName) return;
    this.clientList.set(socket.id, displayName);
    let room = this.roomMapClientList.get('lobby');

    if (!room) {
      room = [];
      //this.mapClients.set('lobby', []);
    }
    //this.joinRoom(socket, 'lobby');
    //socket.join('lobby');
    room.push({ id: socket.id, display: displayName });
    //this.mapClients.set('lobby', room);
  }

  onDisconnect(client: Socket) {
    client.rooms.forEach((room) => {
      this.leaveRoom(client, room);
    });
  }

  joinRoom(socket: Socket, room_id: string) {
    socket.join(room_id);
    let room = this.roomMapClientList.get(room_id);

    if (!room) {
      room = [];
    }
    let clientName = this.clientList.get(socket.id);
    if (!clientName) return;
    room.push({ id: socket.id, display: clientName });
    this.roomMapClientList.set(room_id, room);
    serverVar.to(room_id).emit('onJoinRoom', { room_id: room_id, id: socket.id, displayName: clientName });
    //socket.to(room_id).emit('onJoinRoom', { room_id: room_id, id: socket.id, display: clientName });
  }

  leaveRoom(socket: Socket, room_id: string) {
    let room = this.roomMapClientList.get(room_id);
    if (room) {
      let aux = room.findIndex((x) => {
        return x.id === socket.id;
      });
      if (aux !== -1) {
        room.splice(aux, 1);

        this.roomMapClientList.set(room_id, room);
        socket.leave(room_id);
      }
    }
  }

  sendMessageToRoom(room_id: string, message: string, user: User) {
    events.sendMessageRoom(room_id, message, user);
  }
}
