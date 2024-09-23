import { Server, Socket } from 'socket.io';
import { User } from './user/user.service';
export var serverVar: Server;

export function setServer(server: Server) {
  serverVar = server;
}

export const events = {
  onAnyJoinRoom: 'onAnyJoinRoom',
  onAnyLeaveRoom: 'onAnyLeaveRoom',
  onJoinRoom: 'onJoinRoom',
  onLeaveRoom: 'onLeaveRoom',
  onPublicMessage: 'onMessage',
  onPrivateMessage: 'onPrivateMessage',
  onUserDisconnect: 'onUserDisconnect',
  /**
   * Sends a message to all clients in a room that a user has joined
   * @param room_id The id of the room
   * @param user The user who joined the room
   */
  sendInfoToAllClientsOnJoin(room_id: string, user: User) {
    serverVar.to(room_id).emit(this.onAnyJoinRoom, { room_id: room_id, displayName: user.displayName, id: user.socket_id });
  },

  sendInfoToAllClientsOnLeave(room_id: string, user: User) {
    serverVar.to(room_id).emit(this.onAnyLeaveRoom, { room_id: room_id, displayName: user.displayName, id: user.socket_id });
  },
  sendInfoToAllClientsOnUserDisconect(rooms: string[], user: User) {
    for (let room of rooms) {
      serverVar.to(room).emit(this.onUserDisconnect, { room_id: room, id: user.socket_id });
    }
  },
  /**
   * Sends all users in a room to a socket after joining the room
   * @param socket The socket to send the users to
   * @param room_id The id of the room
   * @param users The users in the room
   */
  sendAllUserOnRoomOnJoin(socket: Socket, room_id: string, users: User[]) {
    serverVar.to(socket.id).emit(this.onJoinRoom, { room_id: room_id, users: users });
  },

  sendMessageRoom(room_id: string, message: string, user: User) {
    serverVar.to(room_id).emit(this.onPublicMessage, { user: user, message: message, room_id: room_id });
  },
};
