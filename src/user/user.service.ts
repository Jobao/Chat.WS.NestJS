import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class UserService {
  clientList: Map<string, User> = new Map();

  addNewClient(socket: Socket, displayName: string) {
    this.clientList.set(socket.id, { displayName: displayName, socket_id: socket.id });
  }

  getClient(socket: Socket) {
    return this.clientList.get(socket.id);
  }

  removeClient(socket: Socket) {
    this.clientList.delete(socket.id);
  }

  getAllUsers(socket_id: string[]) {
    let users: User[] = [];
    for (let socket of socket_id) {
      const aux = this.clientList.get(socket);
      if (aux !== undefined) {
        users.push(aux);
      }
      //users.push(this.clientList.get(socket));
    }
    return users;
  }
}

export type User = {
  displayName: string;
  socket_id: string;
};
