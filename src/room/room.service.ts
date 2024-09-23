import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/user/user.service';
import { events, serverVar } from 'src/wsServer';

@Injectable()
export class RoomService {
  constructor() {}

  roomList = new Map<string, string[]>();

  createRoom(newRoom: string) {
    if (newRoom === '') return;

    if (this.roomList.has(newRoom)) {
      return;
    }

    this.roomList.set(newRoom, []);
  }

  getRoom() {}

  getAllUsersOnRoom(room_id: string) {
    return this.roomList.get(room_id);
  }

  joinRoom(socket: Socket, user: User, room_id: string) {
    let room = this.roomList.get(room_id);
    if (!room) {
      this.roomList.set(room_id, []);
      this.roomList.get(room_id).push(user.socket_id);
    } else {
      room.push(user.socket_id);
      this.roomList.set(room_id, room);
    }
    socket.join(room_id);
  }

  leaveAllRooms(socket: Socket) {
    socket.rooms.forEach((room) => {
      this.leaveRoom(socket, room);
    });
  }

  leaveRoom(socket: Socket, room_id: string) {
    /*socket.leave(room_id);
    let index = this.roomList.get(room_id).indexOf(socket.id);
    if (index !== -1) {
      this.roomList.get(room_id).splice(index, 1);
    }*/
  }
}
