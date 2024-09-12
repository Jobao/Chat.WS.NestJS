import { Server } from 'socket.io';

export var serverVar: Server;

export function setServer(server: Server) {
  serverVar = server;
}
